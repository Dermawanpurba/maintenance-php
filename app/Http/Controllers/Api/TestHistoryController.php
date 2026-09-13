<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TestHistory;
use Illuminate\Http\Request;

class TestHistoryController extends Controller
{
    public function index(Request $request)
    {
        $q = TestHistory::query()->orderByDesc('taken_at')->orderByDesc('id');
        if ($section = $request->query('section')) {
            $q->where('section', strtoupper($section));
        }
        if ($status = $request->query('status')) {
            $q->where('status', strtoupper($status));
        }
        return response()->json($q->get());
    }

    public function show(TestHistory $history)
    {
        return response()->json($history);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'uid' => 'nullable|string|unique:test_histories,uid',
            'title' => 'required|string',
            'section' => 'required|string',
            'taken_at' => 'nullable|date',
            'total_questions' => 'required|integer|min:1',
            'correct_count' => 'required|integer|min:0',
            'percentage' => 'nullable|integer|min:0|max:100',
            'scaled_score' => 'nullable|integer|min:310|max:677',
            'time_spent' => 'nullable|string',
            'status' => 'nullable|string',
            'questions_snapshot' => 'required|array',
            'user_answers' => 'required|array',
        ]);

        if (empty($data['uid'])) {
            $data['uid'] = 'hist-'.(TestHistory::max('id') + 1);
        }
        if (empty($data['taken_at'])) {
            $data['taken_at'] = now();
        }
        // auto compute if missing
        if (!isset($data['percentage'])) {
            $data['percentage'] = (int) round(($data['correct_count'] / $data['total_questions']) * 100);
        }
        if (!isset($data['scaled_score'])) {
            // rough ITP conversion 310-677 from percentage (not official but consistent with frontend)
            $data['scaled_score'] = 310 + (int) round(($data['percentage']/100) * 367);
        }
        if (empty($data['status'])) {
            $data['status'] = $data['percentage'] >= 80 ? 'EXCELLENT' : ($data['percentage'] >= 60 ? 'GOOD' : 'NEED_PRACTICE');
        }

        $h = TestHistory::create($data);
        return response()->json($h, 201);
    }

    public function destroy(TestHistory $history)
    {
        $history->delete();
        return response()->json(['message' => 'deleted']);
    }

    // summary for dashboard KPIs
    public function summary()
    {
        $all = TestHistory::all();
        return response()->json([
            'total_tests' => $all->count(),
            'avg_percentage' => $all->avg('percentage') ? round($all->avg('percentage'), 1) : 0,
            'avg_scaled' => $all->avg('scaled_score') ? round($all->avg('scaled_score')) : 0,
            'best_score' => $all->max('scaled_score') ?? 0,
            'recent' => TestHistory::orderByDesc('taken_at')->limit(5)->get(),
            'trend' => TestHistory::orderBy('taken_at')->limit(8)->get(['taken_at','scaled_score','percentage','title']),
        ]);
    }

    public function exportCsv()
    {
        $rows = TestHistory::orderByDesc('taken_at')->get();
        $csv = "ID,Tanggal,Paket Ujian,Seksi,Total Soal,Jawaban Benar,Akurasi (%),Skor Scaled ITP,Waktu Terpakai,Status\n";
        foreach ($rows as $h) {
            $csv .= "\"{$h->uid}\",\"{$h->taken_at}\",\"".str_replace('"','""',$h->title)."\",\"{$h->section}\",{$h->total_questions},{$h->correct_count},{$h->percentage},{$h->scaled_score},\"{$h->time_spent}\",\"{$h->status}\"\n";
        }
        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="toefl_history.csv"',
        ]);
    }
}
