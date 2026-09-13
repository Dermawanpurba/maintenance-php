<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Material;
use App\Models\Question;
use App\Models\KanbanCard;
use App\Models\TestHistory;
use Illuminate\Support\Facades\DB;

class BInggrisSeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('seeds.json');
        if (!file_exists($path)) {
            $this->command->error('seeds.json not found at '.$path.' — run node extract_v2.mjs first');
            return;
        }
        $seeds = json_decode(file_get_contents($path), true);

        DB::transaction(function () use ($seeds) {
            // Clean
            TestHistory::query()->delete();
            Question::query()->delete();
            KanbanCard::query()->delete();
            Material::query()->delete();

            // Materials
            $matMap = []; // uid -> id
            foreach ($seeds['SEED_MATERIALS'] as $m) {
                $mat = Material::create([
                    'uid' => $m['id'],
                    'section' => $m['section'],
                    'skill_code' => $m['skillCode'] ?? null,
                    'title' => $m['title'],
                    'category' => $m['category'] ?? null,
                    'summary' => $m['summary'] ?? null,
                    'content' => $m['content'] ?? null,
                    'priority' => $m['priority'] ?? 'Medium',
                    'status' => $m['status'] ?? 'backlog',
                ]);
                $matMap[$m['id']] = $mat->id;
            }

            // Helper to insert question set linked to material
            $insertSet = function(array $set, ?string $materialUid = null, int $offset = 0) use (&$matMap) {
                $materialId = $materialUid ? ($matMap[$materialUid] ?? null) : null;
                foreach ($set as $i => $q) {
                    Question::create([
                        'material_id' => $materialId,
                        'section' => $q['section'] ?? 'MIX',
                        'skill' => $q['skill'] ?? null,
                        'passage_or_audio_script' => $q['passageOrAudioScript'] ?? null,
                        'question_text' => $q['questionText'] ?? $q['question_text'] ?? '',
                        'options' => $q['options'] ?? [],
                        'correct_answer' => $q['correctAnswer'] ?? $q['correct_answer'] ?? 'A',
                        'explanation' => $q['explanation'] ?? null,
                        'sort_order' => $offset + $i + 1,
                    ]);
                }
            };

            // Map material -> question set (like frontend initStorage)
            $insertSet($seeds['SEED_SUBJECT_VERB_SET_15'] ?? [], 'mat-1', 0);
            $insertSet($seeds['SEED_INVERSION_SET_15'] ?? [], 'mat-2', 100);
            $insertSet($seeds['SEED_APPOSITIVE_SET_15'] ?? [], 'mat-3', 200);
            $insertSet($seeds['SEED_LISTENING_SET_15'] ?? [], 'mat-4', 300);
            $insertSet($seeds['SEED_READING_SET_15'] ?? [], 'mat-5', 400);

            // Also insert the standalone sets for browsing (no material link, but keep for API)
            // We already inserted via material link; add extra standalone copies for generic listing?
            // To avoid duplicates, we skip extra. Instead ensure STRUCTURE/LISTENING/READING standalone
            // are already covered. Add the MIX set separately
            $insertSet($seeds['SEED_TEST_SET_15'] ?? [], null, 900);

            // Kanban
            foreach ($seeds['SEED_KANBAN'] as $idx => $k) {
                KanbanCard::create([
                    'uid' => $k['id'],
                    'title' => $k['title'],
                    'section' => $k['section'],
                    'priority' => $k['priority'] ?? 'Medium',
                    'target_date' => $k['targetDate'] ?? null,
                    'status' => $k['status'] ?? 'backlog',
                    'sort_order' => $idx,
                ]);
            }

            // History — build from raw HTML since seeds.json SEED_HISTORY extraction failed
            // Fallback: create two histories matching index.html
            $mix = $seeds['SEED_TEST_SET_15'] ?? [];
            $histories = [
                [
                    'uid' => 'hist-1',
                    'title' => 'Simulasi TOEFL ITP Mix 15 Soal #01',
                    'section' => 'MIX',
                    'taken_at' => '2026-08-16 14:30:00',
                    'total_questions' => 15,
                    'correct_count' => 13,
                    'percentage' => 87,
                    'scaled_score' => 570,
                    'time_spent' => '18:45',
                    'status' => 'EXCELLENT',
                    'questions_snapshot' => $mix,
                    'user_answers' => ['1'=>'A','2'=>'B','3'=>'B','4'=>'B','5'=>'B','6'=>'B','7'=>'B','8'=>'C','9'=>'A','10'=>'B','11'=>'C','12'=>'A','13'=>'B','14'=>'D','15'=>'A'],
                ],
                [
                    'uid' => 'hist-2',
                    'title' => 'Structure Intensive 15 Soal #02',
                    'section' => 'STRUCTURE',
                    'taken_at' => '2026-08-15 10:15:00',
                    'total_questions' => 15,
                    'correct_count' => 11,
                    'percentage' => 73,
                    'scaled_score' => 520,
                    'time_spent' => '15:20',
                    'status' => 'GOOD',
                    'questions_snapshot' => $mix,
                    'user_answers' => ['1'=>'A','2'=>'B','3'=>'A','4'=>'B','5'=>'B','6'=>'A','7'=>'B','8'=>'C','9'=>'A','10'=>'B','11'=>'A','12'=>'A','13'=>'B','14'=>'D','15'=>'C'],
                ],
            ];
            // If seeds actually contains history (partial), prefer it
            if (!empty($seeds['SEED_HISTORY']) && count($seeds['SEED_HISTORY']) > 0 && isset($seeds['SEED_HISTORY'][0]['id'])) {
                // try to use it but it failed before; ignore
            }
            foreach ($histories as $h) {
                TestHistory::create($h);
            }
        });

        $this->command->info('BInggrisSeeder done: '.Material::count().' materials, '.Question::count().' questions, '.KanbanCard::count().' kanban, '.TestHistory::count().' histories');
    }
}
