import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import GameCanvas from '../Components/GameCanvas';


const Game = ({ user, activeCar }) => {
  const handleGameOver = (score, coins) => {
    if (user) {
      Inertia.post('/game/save-score', { score, coins_earned: coins });
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Car Game</h1>

        <GameCanvas car={activeCar} onGameOver={handleGameOver} />

    </div>
  );
};

export default Game;