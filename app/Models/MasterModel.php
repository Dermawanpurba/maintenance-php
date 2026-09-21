<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * MasterModel — direktori model alat berat (normalisasi P3.2).
 *
 * Menggantikan fuzzy string matching di PlanningPartService.
 * Setiap MasterEquip dan PartService dihubungkan via model_code.
 *
 * @property string $model_code      Kode unik: 'CAT320GX', 'D8R', 'FUSO_FN62'
 * @property string $model_name      Nama penuh: 'CAT 320 GX'
 * @property string $equipment_type  EXCAVATOR | BULLDOZER | DUMP_TRUCK | MOTOR_GRADER | SUPPORT
 * @property string $unit_type_alias EXCA | DOZER | DT | GREDER
 * @property string $manufacturer    Caterpillar, Komatsu, FUSO, dll
 * @property array  $aliases         Array alias string untuk fallback matching
 */
class MasterModel extends Model
{
    use HasFactory;

    protected $table = 'master_models';
    protected $guarded = [];

    protected $casts = [
        'aliases'   => 'array',
        'is_active' => 'boolean',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────

    /** Unit yang menggunakan model ini */
    public function equipments(): HasMany
    {
        return $this->hasMany(MasterEquip::class, 'model_code', 'model_code');
    }

    /** BOM Part Service yang berlaku untuk model ini */
    public function partServices(): HasMany
    {
        return $this->hasMany(PartService::class, 'model_code', 'model_code');
    }

    // ─── Static Helpers ─────────────────────────────────────────────

    /**
     * Cari MasterModel berdasarkan string bebas (model name / alias).
     * Dipakai sebagai fallback jika model_code belum diisi.
     *
     * @param string $rawModel String mentah dari master_equips.model atau part_services.model
     */
    public static function findByAlias(string $rawModel): ?self
    {
        $raw = strtoupper(trim(preg_replace('/\s+/', ' ', $rawModel)));
        if (empty($raw)) {
            return null;
        }

        // 1. Coba exact match model_code
        $found = static::where('model_code', $raw)->first();
        if ($found) {
            return $found;
        }

        // 2. Coba exact match model_name (case insensitive)
        $found = static::whereRaw('UPPER(TRIM(model_name)) = ?', [$raw])->first();
        if ($found) {
            return $found;
        }

        // 3. Coba alias array
        $all = static::all();
        foreach ($all as $model) {
            $aliases = array_map('strtoupper', array_map('trim', $model->aliases ?? []));
            if (in_array($raw, $aliases, true)) {
                return $model;
            }
        }

        // 4. Coba partial match (str_contains)
        foreach ($all as $model) {
            $name = strtoupper(trim($model->model_name));
            if (str_contains($raw, $name) || str_contains($name, $raw)) {
                return $model;
            }
            foreach ($model->aliases ?? [] as $alias) {
                $a = strtoupper(trim($alias));
                if (str_contains($raw, $a) || str_contains($a, $raw)) {
                    return $model;
                }
            }
        }

        return null;
    }
}
