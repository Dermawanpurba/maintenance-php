<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyHm extends Model
{
    use HasFactory;

    protected $table = 'daily_hms';
    protected $guarded = [];
}
