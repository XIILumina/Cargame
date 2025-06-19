<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCar extends Model
{
    protected $fillable = ['user_id', 'car_id', 'equipped_parts', 'color', 'is_active'];

    protected $casts = [
        'equipped_parts' => 'array',
        'is_active' => 'boolean',
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}