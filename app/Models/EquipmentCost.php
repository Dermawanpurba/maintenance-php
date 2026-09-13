<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentCost extends Model
{
    use HasFactory;

    protected $table = 'equipment_costs';
    protected $guarded = [];
}
