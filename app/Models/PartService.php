<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartService extends Model
{
    use HasFactory;

    protected $table = 'part_services';

    protected $guarded = [];

    protected $casts = [
        'ps_250'  => 'float',
        'ps_500'  => 'float',
        'ps_1000' => 'float',
        'ps_2000' => 'float',
        'ps_4000' => 'float',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Master Model alat berat (P3.2) */
    public function masterModel(): BelongsTo
    {
        return $this->belongsTo(MasterModel::class, 'model_code', 'model_code');
    }

    /** Master part katalog suku cadang */
    public function masterPart(): BelongsTo
    {
        return $this->belongsTo(MasterPart::class, 'part_number', 'part_number');
    }
}

