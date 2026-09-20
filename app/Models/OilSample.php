<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OilSample extends Model
{
    use HasFactory;

    protected $table = 'oil_samples';
    protected $guarded = [];

    protected $casts = [
        'hm' => 'float',
        'top_up' => 'float',
        'si' => 'float',
        'al' => 'float',
        'na' => 'float',
        'fe' => 'float',
        'cu' => 'float',
        'cr' => 'float',
        'pb' => 'float',
        'pq' => 'float',
        'visc_100' => 'float',
        'oxi' => 'float',
        'soot' => 'float',
        'tbn' => 'float',
        'iso_6' => 'float',
        'iso_14' => 'float',
        'water_pct' => 'float',
    ];

    /**
     * Relasi ke Master Armada
     */
    public function equipment()
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    /**
     * Hook model untuk sinkronisasi otomatis dengan entitas lain
     */
    protected static function booted()
    {
        static::saved(function (OilSample $sample) {
            // 1. Sinkronisasi HM ke MasterEquip
            if (!empty($sample->equip_no) && $sample->hm > 0) {
                $master = MasterEquip::where('equip_no', $sample->equip_no)->first();
                if ($master) {
                    if ($sample->hm > ($master->last_hm ?? 0)) {
                        $master->update(['last_hm' => $sample->hm]);
                    }
                }

                // Juga update estimasi HM di target_jam_operasi jika ada
                $target = TargetJamOperasi::where('equip_no', $sample->equip_no)->first();
                if ($target && $sample->hm > ($target->est_hm ?? 0)) {
                    $target->update(['est_hm' => $sample->hm]);
                }
            }

            // 2. Jika temuan lab C (Critical) atau X (Urgent Action), auto-sync ke Backlog Defect
            if (in_array(strtoupper($sample->rating ?? 'A'), ['C', 'X'])) {
                $sampleCode = $sample->sample_code ?: ('ID-' . $sample->id);
                $existingBacklog = Backlog::where('deskripsi_backlog', 'LIKE', "%{$sampleCode}%")->first();
                
                if (!$existingBacklog) {
                    Backlog::create([
                        'item_id' => 'BL-SOS-' . strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $sample->equip_no)) . '-' . time(),
                        'tanggal' => now()->format('Y-m-d'),
                        'equip_no' => $sample->equip_no,
                        'deskripsi_backlog' => "[SOS Alert - Rating {$sample->rating}] Temuan kritis lab pada kompartemen {$sample->compartment}: " . ($sample->interpretation ?: 'Perlu inspeksi internal segera') . " (Ref: {$sampleCode})",
                        'status' => 'OPEN',
                        'rencana_eksekusi' => 'Flushing oil / ganti filter & inspeksi internal kompartemen ' . $sample->compartment,
                        'est_hours' => 4,
                    ]);
                }
            }

            // 3. Catat ke SystemLog
            try {
                SystemLog::create([
                    'timestamp' => now()->format('Y-m-d H:i:s'),
                    'action' => 'Sync_OilSample',
                    'message' => "Hasil SOS {$sample->sample_code} unit {$sample->equip_no} (Rating {$sample->rating}) tersinkronisasi.",
                    'user' => 'SYSTEM'
                ]);
            } catch (\Throwable $e) {}
        });

        static::deleted(function (OilSample $sample) {
            try {
                SystemLog::create([
                    'timestamp' => now()->format('Y-m-d H:i:s'),
                    'action' => 'Delete_OilSample',
                    'message' => "Sampel SOS {$sample->sample_code} unit {$sample->equip_no} dihapus.",
                    'user' => 'SYSTEM'
                ]);
            } catch (\Throwable $e) {}
        });
    }
}
