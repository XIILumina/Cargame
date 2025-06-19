<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameStat extends Model
{
    protected $fillable = ['user_id', 'score', 'coins_earned'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}