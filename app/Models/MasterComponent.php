<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterComponent extends Model
{
    use HasFactory;

    protected $table = 'master_components';
    protected $guarded = [];
}
