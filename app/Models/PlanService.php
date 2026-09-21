<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * PlanService — jadwal PM berikutnya & riwayat service terakhir per unit.
 */
class PlanService extends Model
{
    use HasFactory;

    protected $table = 'plan_services';
    protected $guarded = [];

    protected $casts = [
        'plan_hours_per_month' => 'float',
        'plan_pa'              => 'float',
        'last_service_hm'      => 'float',
        'next_service_hm'      => 'float',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit pemilik jadwal service ini */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    /** Riwayat servis unit ini */
    public function serviceHistories(): HasMany
    {
        return $this->hasMany(ServiceHistory::class, 'equip_no', 'equip_no');
    }
}
