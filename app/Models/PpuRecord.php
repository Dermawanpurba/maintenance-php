<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpuRecord extends Model
{
    use HasFactory;

    protected $table = 'ppu_records';
    protected $guarded = [];

    protected $casts = [
        'pct_hours_track'    => 'float',
        'hours_track_gp'     => 'float',
        'smu'                => 'float',
        'sprocket_lh'        => 'float',
        'sprocket_rh'        => 'float',
        'link_height_lh'     => 'float',
        'link_height_rh'     => 'float',
        'chain_bushing_lh'   => 'float',
        'chain_bushing_rh'   => 'float',
        'frame_ext_lh'       => 'float',
        'frame_ext_rh'       => 'float',
        'grouser_height_lh'  => 'float',
        'grouser_height_rh'  => 'float',
        'idler_front_lh'     => 'float',
        'idler_front_rh'     => 'float',
        'idler_rear_lh'      => 'float',
        'idler_rear_rh'      => 'float',
    ];
}
