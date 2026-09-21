<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * EquipmentCost — transaksi biaya perbaikan & suku cadang per unit.
 */
class EquipmentCost extends Model
{
    use HasFactory;

    protected $table = 'equipment_costs';
    protected $guarded = [];

    protected $casts = [
        'amount' => 'float',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit yang dikenai biaya ini */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }

    /** Work Order sumber biaya (via no_wo string) */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class, 'wo_no', 'no_wo');
    }
}
