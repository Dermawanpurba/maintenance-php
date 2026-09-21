<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Backlog — daftar defect / temuan perbaikan yang belum ditangani (P4.1).
 *
 * Terhubung langsung ke Work Order penanganan via no_wo.
 * Ketika Work Order ditutup (CLOSED), status backlog otomatis sinkron ke CLOSED.
 */
class Backlog extends Model
{
    use HasFactory;

    protected $table = 'backlogs';
    protected $guarded = [];

    protected $casts = [
        'est_hours' => 'float',
        'closed_at' => 'datetime',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit pemilik backlog defect */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    /** Work Order penanganan defect ini (P4.1) */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class, 'no_wo', 'no_wo');
    }

    // ─── Model Hooks ─────────────────────────────────────────────────

    protected static function booted(): void
    {
        static::saving(function (Backlog $backlog): void {
            $status = strtoupper(trim((string) ($backlog->status ?: 'OPEN')));
            $backlog->status = $status;

            if ($status === 'CLOSED' && empty($backlog->closed_at)) {
                $backlog->closed_at = now();
            } elseif ($status !== 'CLOSED' && !empty($backlog->closed_at)) {
                $backlog->closed_at = null;
            }
        });

        static::saved(function (Backlog $backlog): void {
            // Jika ada Work Order yang tertaut dan status backlog CLOSED,
            // pastikan juga relasi dua arah terjaga.
            try {
                SystemLog::create([
                    'timestamp' => now()->format('Y-m-d H:i:s'),
                    'action'    => 'Backlog_Update',
                    'message'   => "Backlog {$backlog->item_id} unit {$backlog->equip_no} status: {$backlog->status}"
                                 . ($backlog->no_wo ? " (WO: {$backlog->no_wo})" : ""),
                    'user'      => 'SYSTEM',
                ]);
            } catch (\Throwable) {}
        });
    }
}
