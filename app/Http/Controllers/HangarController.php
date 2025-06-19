<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Part;
use App\Models\UserCar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HangarController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $cars = $user ? UserCar::where('user_id', $user->id)->with('car')->get() : [];
        $availableCars = Car::all();
        $parts = Part::all();

        return Inertia::render('Hangar', [
            'user' => $user,
            'userCars' => $cars,
            'availableCars' => $availableCars,
            'parts' => $parts,
        ]);
    }

    public function buyCar(Request $request)
    {
        $request->validate(['car_id' => 'required|exists:cars,id']);
        $user = auth()->user();
        $car = Car::find($request->car_id);

        if ($user->coins < $car->cost) {
            return response()->json(['error' => 'Not enough coins'], 400);
        }

        $user->coins -= $car->cost;
        $user->save();

        UserCar::create([
            'user_id' => $user->id,
            'car_id' => $car->id,
            'is_active' => !UserCar::where('user_id', $user->id)->exists(),
        ]);

        return response()->json(['message' => 'Car purchased']);
    }

    public function buyPart(Request $request)
    {
        $request->validate([
            'part_id' => 'required|exists:parts,id',
            'car_id' => 'required|exists:user_cars,id',
        ]);

        $user = auth()->user();
        $part = Part::find($request->part_id);
        $userCar = UserCar::where('user_id', $user->id)->where('id', $request->car_id)->first();

        if (!$userCar) {
            return response()->json(['error' => 'Car not found'], 404);
        }

        if ($user->coins < $part->cost) {
            return response()->json(['error' => 'Not enough coins'], 400);
        }

        $user->coins -= $part->cost;
        $user->save();

        $equippedParts = $userCar->equipped_parts ?? [];
        $equippedParts[] = $part->id;
        $userCar->equipped_parts = $equippedParts;
        $userCar->save();

        return response()->json(['message' => 'Part purchased and equipped']);
    }

    public function setActiveCar(Request $request)
    {
        $request->validate(['car_id' => 'required|exists:user_cars,id']);
        $user = auth()->user();

        UserCar::where('user_id', $user->id)->update(['is_active' => false]);
        UserCar::where('user_id', $user->id)->where('id', $request->car_id)->update(['is_active' => true]);

        return response()->json(['message' => 'Active car set']);
    }

    public function changeColor(Request $request)
    {
        $request->validate([
            'car_id' => 'required|exists:user_cars,id',
            'color' => 'required|string',
        ]);

        $userCar = UserCar::where('user_id', auth()->id())->where('id', $request->car_id)->first();
        if ($userCar) {
            $userCar->color = $request->color;
            $userCar->save();
        }

        return response()->json(['message' => 'Color updated']);
    }
}