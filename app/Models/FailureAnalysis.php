<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FailureAnalysis extends Model
{
    use HasFactory;

    protected $table = 'failure_analyses';
    protected $guarded = [];
}
