<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\HangarController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', [GameController::class, 'index'])->name('game');
Route::get('/leaderboard', [GameController::class, 'leaderboard'])->name('leaderboard');
Route::get('/hangar', [HangarController::class, 'index'])->name('hangar')->middleware('auth');
Route::get('/profile', [ProfileController::class, 'index'])->name('profile')->middleware('auth');
Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update')->middleware('auth');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware('auth')->group(function () {
    Route::post('/game/save-score', [GameController::class, 'saveScore']);
    Route::post('/hangar/buy-car', [HangarController::class, 'buyCar']);
    Route::post('/hangar/buy-part', [HangarController::class, 'buyPart']);
    Route::post('/hangar/set-active-car', [HangarController::class, 'setActiveCar']);
    Route::post('/hangar/change-color', [HangarController::class, 'changeColor']);
});

require __DIR__.'/auth.php';
