<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * PsScheduleBacklog — Item Backlog yang dibundel ke dalam suatu slot servis berkala.
 */
class PsScheduleBacklog extends Model
{
    use HasFactory;

    protected $table = 'ps_schedule_backlogs';
    protected $guarded = [];

    protected $casts = [
        'av_parts_percent' => 'float',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────────

    /** Jadwal PS induk */
    public function psSchedule(): BelongsTo
    {
        return $this->belongsTo(PsSchedule::class, 'ps_schedule_id', 'id');
    }

    /** Referensi ke data backlog defect di tabel master backlogs */
    public function backlog(): BelongsTo
    {
        return $this->belongsTo(Backlog::class, 'backlog_id', 'item_id');
    }

    /** Work Order perbaikan defect ini jika terpisah */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class, 'wo_no', 'no_wo');
    }
}
