<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PcrComponent extends Model
{
    use HasFactory;

    protected $table = 'pcr_components';
    protected $guarded = [];
}
