<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Inspection — form P2H / inspeksi kondisi unit.
 */
class Inspection extends Model
{
    use HasFactory;

    protected $table = 'inspections';
    protected $guarded = [];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit yang diinspeksi */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(MasterEquip::class, 'equip_no', 'equip_no');
    }
}
