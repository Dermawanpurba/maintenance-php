<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * MasterMekanik — direktori mekanik/teknisi.
 */
class MasterMekanik extends Model
{
    use HasFactory;

    protected $table = 'master_mekaniks';
    protected $guarded = [];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Semua aktivitas yang pernah dikerjakan mekanik ini */
    public function activities(): HasMany
    {
        return $this->hasMany(MechanicActivity::class, 'mekanik', 'nama_mekanik');
    }
}
