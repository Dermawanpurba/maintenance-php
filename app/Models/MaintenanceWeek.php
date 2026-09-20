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
}
