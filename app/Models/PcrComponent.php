<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * PcrComponent — tracking lifetime komponen mayor per unit (engine, UC, dll).
 */
class PcrComponent extends Model
{
    use HasFactory;

    protected $table = 'pcr_components';
    protected $guarded = [];

    protected $casts = [
        'target_lifetime_hm' => 'float',
        'current_hm'         => 'float',
        'remaining_hm'       => 'float',
        'estimated_cost'     => 'float',
        'install_hm'         => 'float',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit pemilik komponen ini */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    // ─── Accessor ───────────────────────────────────────────────────

    /** Persentase life terpakai */
    public function getLifePercentAttribute(): float
    {
        if (!$this->target_lifetime_hm || $this->target_lifetime_hm <= 0) {
            return 0;
        }
        return round(min(100, ($this->current_hm / $this->target_lifetime_hm) * 100), 1);
    }
}
