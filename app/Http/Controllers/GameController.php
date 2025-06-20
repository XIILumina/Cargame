<?php

namespace App\Http\Controllers;

use App\Models\GameStat;
use App\Models\User;
use App\Models\UserCar;
use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


class GameController extends Controller
{
    public function welcome()
    {
        $stats = GameStat::with('user')
            ->orderBy('score', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Welcome', [
            'stats' => $stats,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    public function index()
    {
        $user = Auth::user();
        $activeCar = $user 
            ? UserCar::where('user_id', $user->id)->where('is_active', true)->with('car')->first()
            : Car::where('name', 'Starter Car')->first(); // Default car for guests

        $stats = GameStat::with('user')
            ->orderBy('score', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Game', [
            'user' => $user,
            'activeCar' => $activeCar,
            'stats' => $stats,
        ]);
    }

    public function saveScore(Request $request)
    {
        $request->validate([
            'score' => 'required|integer',
            'coins_earned' => 'required|integer',
        ]);

        if (Auth::check()) {
            GameStat::create([
                'user_id' => Auth::id(),
                'score' => $request->score,
                'coins_earned' => $request->coins_earned,
            ]);

            $user = User::find(Auth::id());
            $user->coins += $request->coins_earned;
            $user->save();
        }

        return response()->json(['message' => 'Score saved']);
    }

    public function leaderboard()
    {
        $stats = GameStat::with('user')
            ->orderBy('score', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Leaderboard', ['stats' => $stats]);
    }
}