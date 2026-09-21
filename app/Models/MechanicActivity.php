<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * MechanicActivity — aktivitas jam kerja mekanik per WO.
 */
class MechanicActivity extends Model
{
    use HasFactory;

    protected $table = 'mechanic_activities';
    protected $guarded = [];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Work Order yang dikerjakan */
    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class, 'no_wo', 'no_wo');
    }

    /** Mekanik yang bekerja (via nama, bukan FK id) */
    public function masterMekanik(): BelongsTo
    {
        return $this->belongsTo(MasterMekanik::class, 'mekanik', 'nama_mekanik');
    }
}
