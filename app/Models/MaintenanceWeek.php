<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceWeek extends Model
{
    use HasFactory;

    protected $table = 'maintenance_weeks';
    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'target_compliance' => 'integer',
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];

    protected static function booted(): void
    {
        static::saving(function (MaintenanceWeek $week): void {
            $week->week_no = strtoupper(trim((string) $week->week_no));
            $week->label = filled($week->label) ? trim((string) $week->label) : $week->week_no;
        });

        static::saved(function (MaintenanceWeek $week): void {
            if (!$week->is_active) {
                return;
            }

            static::query()
                ->whereKeyNot($week->getKey())
                ->where('is_active', true)
                ->update(['is_active' => false]);
        });
    }
}
