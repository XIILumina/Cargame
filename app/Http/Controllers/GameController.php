<?php

namespace App\Http\Controllers;

use App\Models\GameStat;
use App\Models\User;
use App\Models\UserCar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $activeCar = $user ? UserCar::where('user_id', $user->id)->where('is_active', true)->with('car')->first() : null;

        return Inertia::render('Game', [
            'user' => $user,
            'activeCar' => $activeCar,
        ]);
    }

    public function saveScore(Request $request)
    {
        $request->validate([
            'score' => 'required|integer',
            'coins_earned' => 'required|integer',
        ]);

        if (auth()->check()) {
            GameStat::create([
                'user_id' => auth()->id(),
                'score' => $request->score,
                'coins_earned' => $request->coins_earned,
            ]);

            $user = User::find(auth()->id());
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