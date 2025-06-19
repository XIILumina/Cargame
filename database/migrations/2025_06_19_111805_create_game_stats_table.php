<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('score'); // Time survived in seconds
            $table->integer('coins_earned');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_stats');
    }
};