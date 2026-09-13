<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index(Request $request)
    {
        $q = Question::query();
        if ($section = $request->query('section')) {
            // allow MIX or STRUCTURE etc, case-insensitive
            $q->where('section', strtoupper($section));
        }
        if ($skill = $request->query('skill')) {
            $q->where('skill', 'like', "%{$skill}%");
        }
        if ($materialId = $request->query('material_id')) {
            $q->where('material_id', $materialId);
        }
        if ($search = $request->query('search')) {
            $q->where(function($w) use ($search){
                $w->where('question_text','like',"%{$search}%")
                  ->orWhere('skill','like',"%{$search}%");
            });
        }
        $limit = min((int)$request->query('limit', 100), 100);
        return response()->json(
            $q->orderBy('sort_order')->limit($limit)->get()
        );
    }

    public function show(Question $question)
    {
        return response()->json($question);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'material_id' => 'nullable|exists:materials,id',
            'section' => 'required|string',
            'skill' => 'nullable|string',
            'passage_or_audio_script' => 'nullable|string',
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'correct_answer' => 'required|string|in:A,B,C,D',
            'explanation' => 'nullable|array',
            'sort_order' => 'nullable|integer',
        ]);
        $q = Question::create($data);
        return response()->json($q, 201);
    }

    public function update(Request $request, Question $question)
    {
        $data = $request->validate([
            'material_id' => 'nullable|exists:materials,id',
            'section' => 'sometimes|string',
            'skill' => 'nullable|string',
            'passage_or_audio_script' => 'nullable|string',
            'question_text' => 'sometimes|string',
            'options' => 'sometimes|array|min:2',
            'correct_answer' => 'sometimes|string|in:A,B,C,D',
            'explanation' => 'nullable|array',
            'sort_order' => 'nullable|integer',
        ]);
        $question->update($data);
        return response()->json($question);
    }

    public function destroy(Question $question)
    {
        $question->delete();
        return response()->json(['message' => 'deleted']);
    }

    // Preset packs matching frontend: mix/structure/listening/reading
    public function pack(string $name)
    {
        $map = [
            'mix' => 15,
            'structure' => 15,
            'listening' => 15,
            'reading' => 15,
        ];
        $key = strtolower($name);
        if (!isset($map[$key])) {
            return response()->json(['error' => 'unknown pack, use mix|structure|listening|reading'], 404);
        }
        // Prefer questions without material link for MIX pack (sort 900+), else by section
        if ($key === 'mix') {
            $questions = Question::whereNull('material_id')->orderBy('sort_order')->limit(15)->get();
            if ($questions->count() < 15) {
                // fallback: take 5 each from STRUCTURE/LISTENING/READING via material-linked
                $questions = Question::whereIn('section', ['STRUCTURE','LISTENING','READING'])
                    ->inRandomOrder()->limit(15)->get();
            }
        } else {
            $questions = Question::where('section', strtoupper($key))->orderBy('sort_order')->limit(15)->get();
        }
        return response()->json([
            'pack' => $key,
            'total' => $questions->count(),
            'questions' => $questions,
        ]);
    }
}
