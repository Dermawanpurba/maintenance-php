<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SwabComponent extends Model
{
    use HasFactory;

    protected $table = 'swab_components';
    protected $guarded = [];
}
