<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiProxyController extends Controller
{
    public function health()
    {
        return response()->json(['ok' => true, 'proxy' => 'ready', 'time' => now()->toIso8601String()]);
    }

    public function chat(Request $request)
    {
        $payload = $request->all();
        if (empty($payload)) {
            return response()->json(['error' => ['message' => 'Empty request body', 'type' => 'invalid_request_error']], 400);
        }
        if (empty($payload['model'])) {
            $payload['model'] = config('services.siaptuan.model', 'siaptuan_premium');
        }

        $apiKey = config('services.siaptuan.key') ?: env('SIAPTUAN_API_KEY');
        $baseUrl = config('services.siaptuan.base_url') ?: env('SIAPTUAN_BASE_URL', 'https://siaptuan.my.id/v1');
        $insecure = filter_var(env('SIAPTUAN_INSECURE_SSL', true), FILTER_VALIDATE_BOOLEAN);

        if (empty($apiKey)) {
            return response()->json(['error' => ['message' => 'SIAPTUAN_API_KEY not configured', 'type' => 'proxy_configuration_error']], 500);
        }

        $url = rtrim($baseUrl, '/') . '/chat/completions';

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $apiKey,
        ])
        ->withOptions([
            'verify' => !$insecure,
            'connect_timeout' => 20,
            'timeout' => 90,
        ])->post($url, $payload);

        return response()->json($response->json(), $response->status());
    }

    // Generate materi / soal via AI — returns parsed JSON if model returns JSON block
    public function generate(Request $request)
    {
        $data = $request->validate([
            'section' => 'required|string', // STRUCTURE/LISTENING/READING/MIX
            'topic' => 'required|string',
            'count' => 'nullable|integer|min:1|max:20',
            'type' => 'nullable|string|in:materi,questions,mixed',
        ]);

        $count = $data['count'] ?? 5;
        $type = $data['type'] ?? 'questions';
        $section = strtoupper($data['section']);

        $systemPrompt = $this->buildSystemPrompt($section, $type, $count);

        $userPrompt = "Topik: {$data['topic']}\nBagian: {$section}\nJumlah: {$count}\nTipe: {$type}\n\nBuat sesuai format JSON yang diminta di system prompt. Hanya output JSON valid tanpa markdown.";

        // reuse chat proxy internally
        $payload = [
            'model' => config('services.siaptuan.model', 'siaptuan_premium'),
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userPrompt],
            ],
            'temperature' => 0.7,
        ];

        // forward to upstream
        $apiKey = config('services.siaptuan.key') ?: env('SIAPTUAN_API_KEY');
        $baseUrl = config('services.siaptuan.base_url') ?: env('SIAPTUAN_BASE_URL', 'https://siaptuan.my.id/v1');
        $insecure = filter_var(env('SIAPTUAN_INSECURE_SSL', true), FILTER_VALIDATE_BOOLEAN);
        $url = rtrim($baseUrl, '/') . '/chat/completions';

        $resp = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $apiKey,
        ])->withOptions(['verify' => !$insecure, 'timeout' => 90])->post($url, $payload);

        $json = $resp->json();
        $content = $json['choices'][0]['message']['content'] ?? null;

        // try to extract JSON block from content
        $parsed = null;
        if ($content) {
            if (preg_match('/```json\s*([\s\S]*?)```/', $content, $m)) {
                $content = $m[1];
            }
            $decoded = json_decode($content, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $parsed = $decoded;
            }
        }

        return response()->json([
            'raw' => $json,
            'parsed' => $parsed,
            'content' => $content,
            'status' => $resp->status(),
        ], $resp->successful() ? 200 : $resp->status());
    }

    private function buildSystemPrompt(string $section, string $type, int $count): string
    {
        if ($type === 'materi') {
            return "Kamu adalah generator materi TOEFL ITP berbahasa Indonesia. Output JSON valid dengan field: title, skill_code, section, category, summary, content (HTML ringkas dengan h4, p, ul, div). Section=$section.";
        }
        // questions
        return "Kamu adalah generator soal TOEFL ITP. Output JSON array dengan $count objek, masing-masing field: section($section), skill, passageOrAudioScript (null jika STRUCTURE), questionText, options (array 4 string), correctAnswer (A/B/C/D), explanation{whyCorrect, whyOthersWrong{A,B,C,D}, grammarRule, vocabulary}. Hanya JSON valid.";
    }
}
