<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Catatan HM (Hour Meter) harian per unit.
 *
 * Hook:
 * - saved : sync hm_akhir → master_equips.last_hm & target_jam_operasi.est_hm
 */
class DailyHm extends Model
{
    use HasFactory;

    protected $table = 'daily_hms';
    protected $guarded = [];

    protected $casts = [
        'hm_awal'  => 'float',
        'hm_akhir' => 'float',
        'total_hm' => 'float',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit pemilik catatan HM ini */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    // ─── Model Hooks ─────────────────────────────────────────────────

    protected static function booted(): void
    {
        static::saved(function (DailyHm $hm): void {
            // Hanya proses jika equip_no dan hm_akhir valid
            if (blank($hm->equip_no) || ($hm->hm_akhir ?? 0) <= 0) {
                return;
            }

            $hmAkhir = (float) $hm->hm_akhir;

            // 1. Update master_equips.last_hm jika hm_akhir lebih besar
            MasterEquip::where('equip_no', $hm->equip_no)
                ->where(function ($q) use ($hmAkhir) {
                    $q->whereNull('last_hm')
                      ->orWhere('last_hm', '<', $hmAkhir);
                })
                ->update(['last_hm' => $hmAkhir]);

            // 2. Update target_jam_operasi.est_hm pada periode bulan yang sama
            //    (ambil tahun & bulan dari field tanggal)
            $tanggal = $hm->tanggal;
            if (filled($tanggal)) {
                try {
                    $date  = \Carbon\Carbon::parse($tanggal);
                    $year  = $date->year;
                    $month = $date->month;

                    TargetJamOperasi::where('equip_no', $hm->equip_no)
                        ->where('plan_year', $year)
                        ->where('plan_month', $month)
                        ->where(function ($q) use ($hmAkhir) {
                            $q->whereNull('est_hm')
                              ->orWhere('est_hm', '<', $hmAkhir);
                        })
                        ->update(['est_hm' => $hmAkhir]);
                } catch (\Throwable) {
                    // Tanggal tidak valid — skip update TargetJamOperasi
                }
            }

            // 3. Catat ke SystemLog
            try {
                SystemLog::create([
                    'timestamp' => now()->format('Y-m-d H:i:s'),
                    'action'    => 'DailyHm_Sync',
                    'message'   => "HM unit {$hm->equip_no} diupdate ke {$hmAkhir} Jam dari catatan harian ({$hm->tanggal}).",
                    'user'      => 'SYSTEM',
                ]);
            } catch (\Throwable) {}
        });
    }
}
