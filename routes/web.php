<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\HangarController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [GameController::class, 'welcome'])->name('welcome');
Route::get('/game/play', [GameController::class, 'index'])->name('game.play');
Route::get('/leaderboard', [GameController::class, 'leaderboard'])->name('leaderboard');
Route::get('/hangar', [HangarController::class, 'index'])->name('hangar')->middleware('auth');
Route::get('/profile', [ProfileController::class, 'index'])->name('profile')->middleware('auth');
Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update')->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::post('/game/save-score', [GameController::class, 'saveScore']);
    Route::post('/hangar/buy-car', [HangarController::class, 'buyCar']);
    Route::post('/hangar/buy-part', [HangarController::class, 'buyPart']);
    Route::post('/hangar/set-active-car', [HangarController::class, 'setActiveCar']);
    Route::post('/hangar/change-color', [HangarController::class, 'changeColor']);
});

require __DIR__.'/auth.php';