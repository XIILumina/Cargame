<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // engine, tires, transmission, color, brakes, turbo, nitrous
            $table->integer('cost');
            $table->integer('max_speed_boost')->default(0);
            $table->integer('acceleration_boost')->default(0);
            $table->integer('brake_strength_boost')->default(0);
            $table->integer('turning_speed_boost')->default(0);
            $table->integer('nitrous_boost')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parts');
    }
};