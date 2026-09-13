<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KanbanCard;
use Illuminate\Http\Request;

class KanbanController extends Controller
{
    public function index(Request $request)
    {
        $q = KanbanCard::query();
        if ($status = $request->query('status')) {
            $q->where('status', $status);
        }
        if ($section = $request->query('section')) {
            $q->where('section', strtoupper($section));
        }
        return response()->json($q->orderBy('sort_order')->orderBy('id')->get());
    }

    public function show(KanbanCard $kanban)
    {
        // route model binding uses {kanban}
        return response()->json($kanban);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'uid' => 'nullable|string|unique:kanban_cards,uid',
            'title' => 'required|string|max:255',
            'section' => 'required|string',
            'priority' => 'nullable|string',
            'target_date' => 'nullable|date',
            'status' => 'nullable|string|in:backlog,in_progress,testing,done',
            'sort_order' => 'nullable|integer',
        ]);
        if (empty($data['uid'])) {
            $data['uid'] = 'kb-'.(KanbanCard::max('id') + 1);
        }
        $card = KanbanCard::create($data);
        return response()->json($card, 201);
    }

    public function update(Request $request, KanbanCard $kanban)
    {
        $data = $request->validate([
            'uid' => 'sometimes|string|unique:kanban_cards,uid,'.$kanban->id,
            'title' => 'sometimes|string|max:255',
            'section' => 'sometimes|string',
            'priority' => 'nullable|string',
            'target_date' => 'nullable|date',
            'status' => 'nullable|string|in:backlog,in_progress,testing,done',
            'sort_order' => 'nullable|integer',
        ]);
        $kanban->update($data);
        return response()->json($kanban);
    }

    public function move(Request $request, KanbanCard $kanban)
    {
        $data = $request->validate([
            'status' => 'required|string|in:backlog,in_progress,testing,done',
        ]);
        $kanban->update(['status' => $data['status']]);
        return response()->json($kanban);
    }

    public function destroy(KanbanCard $kanban)
    {
        $kanban->delete();
        return response()->json(['message' => 'deleted']);
    }

    // for drag-drop reorder: expects { ordered_ids: [3,1,2] }
    public function reorder(Request $request)
    {
        $data = $request->validate([
            'ordered_ids' => 'required|array',
            'ordered_ids.*' => 'exists:kanban_cards,id',
        ]);
        foreach ($data['ordered_ids'] as $idx => $id) {
            KanbanCard::where('id', $id)->update(['sort_order' => $idx]);
        }
        return response()->json(['message' => 'reordered']);
    }
}
