<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    protected $fillable = [
        'name', 'sprite_path', 'cost', 'base_max_speed',
        'base_acceleration', 'base_brake_strength', 'base_turning_speed', 'base_nitrous'
    ];
}