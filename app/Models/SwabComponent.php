<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * SwabComponent — catatan kanibalisasi / peminjaman komponen antar armada (P4.3).
 */
class SwabComponent extends Model
{
    use HasFactory;

    protected $table = 'swab_components';
    protected $guarded = [];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit donor (pemberi komponen) */
    public function donorEquipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'donor_unit', 'equip_no');
    }

    /** Unit target (penerima komponen) */
    public function targetEquipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'target_unit', 'equip_no');
    }

    /** Work Order pemasangan swab ini (P4.3) */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class, 'no_wo', 'no_wo');
    }

    /** Tracking komponen PCR terkait (P4.3) */
    public function pcrComponent(): BelongsTo
    {
        return $this->belongsTo(PcrComponent::class, 'pcr_component_id', 'id');
    }

    // ─── Model Hooks ─────────────────────────────────────────────────

    protected static function booted(): void
    {
        static::saved(function (SwabComponent $sc): void {
            try {
                SystemLog::create([
                    'timestamp' => now()->format('Y-m-d H:i:s'),
                    'action'    => 'SwabComponent_Save',
                    'message'   => "Swab komponen {$sc->component_name}: Donor {$sc->donor_unit} → Target {$sc->target_unit} (Status: {$sc->status})"
                                 . ($sc->no_wo ? " [WO: {$sc->no_wo}]" : ""),
                    'user'      => $sc->authorized_by ?: 'SYSTEM',
                ]);
            } catch (\Throwable) {}
        });
    }
}
