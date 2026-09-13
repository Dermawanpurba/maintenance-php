<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PmRecord extends Model
{
    use HasFactory;

    protected $table = 'pm_records';
    protected $guarded = [];
}
