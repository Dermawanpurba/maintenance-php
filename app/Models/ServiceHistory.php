<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ServiceHistory — arsip setiap pelaksanaan servis yang telah selesai.
 */
class ServiceHistory extends Model
{
    use HasFactory;

    protected $table = 'service_histories';
    protected $guarded = [];

    protected $casts = [
        'plan_hm'   => 'float',
        'actual_hm' => 'float',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit yang diservis */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    /** Jadwal service induk */
    public function planService(): BelongsTo
    {
        return $this->belongsTo(PlanService::class, 'equip_no', 'equip_no');
    }
}
