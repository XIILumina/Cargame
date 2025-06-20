import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import GameCanvas from '../Components/GameCanvas';
import Navbar from '../Components/Navbar';

const Game = ({ user, activeCar, stats }) => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameOver = (score, coins) => {
    if (user) {
      Inertia.post('/game/save-score', { score, coins_earned: coins });
    }
    setGameStarted(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar canLogin={true} canRegister={true} />
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl px-4">
          <h1 className="text-4xl font-bold text-center mb-4">🚗 Speed Rush</h1>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">Leaderboard</h2>
            <div className="grid grid-cols-1 gap-4">
              {stats.length > 0 ? (
                stats.map((stat, index) => (
                  <div key={stat.id} className="flex justify-between bg-gray-700 p-3 rounded">
                    <span>{index + 1}. {stat.user.name}</span>
                    <span>Score: {stat.score} | Coins: {stat.coins_earned}</span>
                  </div>
                ))
              ) : (
                <p className="text-center">No scores yet!</p>
              )}
            </div>
          </div>
          {!gameStarted ? (
            <button
              onClick={() => setGameStarted(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition duration-300"
            >
              Start Game
            </button>
          ) : (
            <div className="relative">
              <GameCanvas car={activeCar} onGameOver={handleGameOver} />
              <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-75 p-2 rounded">
                <p className="text-lg">Score: <span id="score">0</span></p>
                <p className="text-lg">Coins: <span id="coins">0</span></p>
                <p className="text-lg">Nitrous: <span id="nitrous">0</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;