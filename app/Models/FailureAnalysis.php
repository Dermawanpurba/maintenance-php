<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * FailureAnalysis — Root Cause Analysis (RCA) / 5-Why per kejadian breakdown (P4.2).
 *
 * Terhubung langsung ke Work Order breakdown via no_wo.
 */
class FailureAnalysis extends Model
{
    use HasFactory;

    protected $table = 'failure_analyses';
    protected $guarded = [];

    protected $casts = [
        'five_why_json'  => 'array',
        'fishbone_json'  => 'array',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit yang mengalami kegagalan */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    /** Work Order breakdown terkait (P4.2) */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class, 'no_wo', 'no_wo');
    }

    // ─── Model Hooks ─────────────────────────────────────────────────

    protected static function booted(): void
    {
        static::saved(function (FailureAnalysis $fa): void {
            try {
                SystemLog::create([
                    'timestamp' => now()->format('Y-m-d H:i:s'),
                    'action'    => 'FailureAnalysis_Save',
                    'message'   => "FAR {$fa->item_id} unit {$fa->equip_no} komponen {$fa->component_name} disimpan (Status: {$fa->status})"
                                 . ($fa->no_wo ? " [WO: {$fa->no_wo}]" : ""),
                    'user'      => $fa->lead_investigator ?: 'SYSTEM',
                ]);
            } catch (\Throwable) {}
        });
    }
}
