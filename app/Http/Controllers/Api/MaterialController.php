<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        $q = Material::query()->withCount('questions');
        if ($section = $request->query('section')) {
            $q->where('section', strtoupper($section));
        }
        if ($status = $request->query('status')) {
            $q->where('status', $status);
        }
        if ($search = $request->query('search')) {
            $q->where(function($w) use ($search){
                $w->where('title','like',"%{$search}%")
                  ->orWhere('summary','like',"%{$search}%")
                  ->orWhere('skill_code','like',"%{$search}%");
            });
        }
        return response()->json($q->orderBy('id')->get());
    }

    public function show(Material $material)
    {
        return response()->json($material->load(['questions']));
    }

    // support both numeric id and uid (mat-1)
    public function showByUid(string $uid)
    {
        $m = Material::where('uid', $uid)->with(['questions'])->firstOrFail();
        return response()->json($m);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'uid' => 'required|string|unique:materials,uid',
            'section' => 'required|string',
            'skill_code' => 'nullable|string',
            'title' => 'required|string|max:255',
            'category' => 'nullable|string',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'priority' => 'nullable|string',
            'status' => 'nullable|string',
        ]);
        $mat = Material::create($data);
        return response()->json($mat, 201);
    }

    public function update(Request $request, Material $material)
    {
        $data = $request->validate([
            'uid' => 'sometimes|string|unique:materials,uid,'.$material->id,
            'section' => 'sometimes|string',
            'skill_code' => 'nullable|string',
            'title' => 'sometimes|string|max:255',
            'category' => 'nullable|string',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'priority' => 'nullable|string',
            'status' => 'nullable|string',
        ]);
        $material->update($data);
        return response()->json($material);
    }

    public function destroy(Material $material)
    {
        $material->delete();
        return response()->json(['message' => 'deleted']);
    }

    // bank soal per materi (savedQuestions)
    public function questions(Material $material, Request $request)
    {
        $q = $material->questions();
        if ($section = $request->query('section')) {
            $q->where('section', strtoupper($section));
        }
        return response()->json($q->orderBy('sort_order')->get());
    }
}
