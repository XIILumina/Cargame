<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sprite_path');
            $table->integer('cost');
            $table->integer('base_max_speed')->default(100);
            $table->integer('base_acceleration')->default(5);
            $table->integer('base_brake_strength')->default(5);
            $table->integer('base_turning_speed')->default(5);
            $table->integer('base_nitrous')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};