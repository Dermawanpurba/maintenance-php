<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MechanicActivity extends Model
{
    use HasFactory;

    protected $table = 'mechanic_activities';
    protected $guarded = [];
}
