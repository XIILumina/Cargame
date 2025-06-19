<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\Part;
use App\Models\User;
use App\Models\UserCar;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'coins' => 1000,
        ]);

        $car = Car::create([
            'name' => 'Starter Car',
            'sprite_path' => 'car1.png',
            'cost' => 0,
            'base_max_speed' => 100,
            'base_acceleration' => 5,
            'base_brake_strength' => 5,
            'base_turning_speed' => 5,
            'base_nitrous' => 0,
        ]);

        UserCar::create([
            'user_id' => $user->id,
            'car_id' => $car->id,
            'is_active' => true,
        ]);

        Car::create([
            'name' => 'Sports Car',
            'sprite_path' => 'car2.png',
            'cost' => 500,
            'base_max_speed' => 120,
            'base_acceleration' => 7,
            'base_brake_strength' => 6,
            'base_turning_speed' => 6,
            'base_nitrous' => 10,
        ]);

        Part::create([
            'name' => 'V8 Engine',
            'type' => 'engine',
            'cost' => 200,
            'max_speed_boost' => 20,
            'acceleration_boost' => 2,
        ]);

        Part::create([
            'name' => 'Racing Tires',
            'type' => 'tires',
            'cost' => 150,
            'turning_speed_boost' => 3,
        ]);

        Part::create([
            'name' => 'Nitrous Boost',
            'type' => 'nitrous',
            'cost' => 300,
            'nitrous_boost' => 50,
        ]);
    }
}