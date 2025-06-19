<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    protected $fillable = [
        'name', 'type', 'cost', 'max_speed_boost', 'acceleration_boost',
        'brake_strength_boost', 'turning_speed_boost', 'nitrous_boost'
    ];
}