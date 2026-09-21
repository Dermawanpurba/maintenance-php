<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * PM Record — rekaman pelaksanaan Preventive Maintenance.
 *
 * Hook:
 * - saved : jika status DONE →
 *           (1) update PlanService last_service_* & next_service_hm
 *           (2) auto-create ServiceHistory
 *           (3) update MasterEquip.last_hm jika hm_pm lebih besar
 */
class PmRecord extends Model
{
    use HasFactory;

    protected $table = 'pm_records';
    protected $guarded = [];

    protected $casts = [
        'hm_pm' => 'float',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit yang di-PM */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    // ─── Model Hooks ─────────────────────────────────────────────────

    protected static function booted(): void
    {
        static::saved(function (PmRecord $pm): void {
            // Hanya proses jika PM sudah selesai dan equip_no valid
            if (strtoupper($pm->status ?? '') !== 'DONE') {
                return;
            }

            if (blank($pm->equip_no) || ($pm->hm_pm ?? 0) <= 0) {
                return;
            }

            $hmPm    = (float) $pm->hm_pm;
            $pmType  = strtoupper(trim($pm->pm_type ?? ''));
            $tanggal = $pm->tanggal;

            // Ekstrak interval dari pm_type (contoh: "PS-250" atau "PS 250" → 250)
            preg_match('/(\d+)/', $pmType, $matches);
            $intervalHm = isset($matches[1]) ? (int) $matches[1] : 250;
            $nextHm     = $hmPm + $intervalHm;

            // ──────────────────────────────────────────────────────────
            // 1. Update PlanService
            // ──────────────────────────────────────────────────────────
            PlanService::where('equip_no', $pm->equip_no)
                ->update([
                    'last_service_hm'   => $hmPm,
                    'last_service_date' => $tanggal,
                    'next_service_hm'   => $nextHm,
                ]);

            // ──────────────────────────────────────────────────────────
            // 2. Auto-create ServiceHistory (hanya jika belum ada entri
            //    dengan equip_no + actual_hm yang sama)
            // ──────────────────────────────────────────────────────────
            $alreadyExists = ServiceHistory::where('equip_no', $pm->equip_no)
                ->where('actual_hm', $hmPm)
                ->exists();

            if (!$alreadyExists) {
                $planHm = PlanService::where('equip_no', $pm->equip_no)
                    ->value('next_service_hm') ?? $hmPm;

                ServiceHistory::create([
                    'item_id'     => 'SH-' . strtoupper(preg_replace('/\s+/', '', $pm->equip_no))
                                   . '-' . now()->format('YmdHis'),
                    'equip_no'    => $pm->equip_no,
                    'plan_hm'     => $planHm,
                    'plan_date'   => null,
                    'actual_hm'   => $hmPm,
                    'actual_date' => $tanggal,
                    'timestamp'   => now()->format('Y-m-d H:i:s'),
                ]);
            }

            // ──────────────────────────────────────────────────────────
            // 3. Update MasterEquip.last_hm jika lebih besar
            // ──────────────────────────────────────────────────────────
            MasterEquip::where('equip_no', $pm->equip_no)
                ->where(function ($q) use ($hmPm) {
                    $q->whereNull('last_hm')
                      ->orWhere('last_hm', '<', $hmPm);
                })
                ->update(['last_hm' => $hmPm]);

            // ──────────────────────────────────────────────────────────
            // 4. SystemLog
            // ──────────────────────────────────────────────────────────
            try {
                SystemLog::create([
                    'timestamp' => now()->format('Y-m-d H:i:s'),
                    'action'    => 'PmRecord_Done',
                    'message'   => "PM {$pmType} unit {$pm->equip_no} DONE @ {$hmPm} Jam. "
                                 . "PlanService diupdate: last={$hmPm}, next={$nextHm}. "
                                 . "ServiceHistory auto-created.",
                    'user'      => 'SYSTEM',
                ]);
            } catch (\Throwable) {}
        });
    }
}
