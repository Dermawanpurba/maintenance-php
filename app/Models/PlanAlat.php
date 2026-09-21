<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * PlanAlat — rencana operasi bulanan per unit (PA target, jam plan, dll).
 */
class PlanAlat extends Model
{
    use HasFactory;

    protected $table = 'plan_alats';
    protected $guarded = [];

    protected $casts = [
        'plan_hours_per_month' => 'float',
        'plan_pa'              => 'float',
        'mohh'                 => 'float',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit pemilik rencana alat ini */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }
}
