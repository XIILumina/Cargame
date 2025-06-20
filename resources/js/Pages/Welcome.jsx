import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import Navbar from '../Components/Navbar';

const Welcome = ({ stats, canLogin, canRegister }) => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar canLogin={canLogin} canRegister={canRegister} />
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl px-4">
          <h1 className="text-5xl font-bold text-center mb-8">🚗 Speed Rush</h1>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
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
          <InertiaLink
            href="/game/play"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition duration-300"
          >
            Start Game
          </InertiaLink>
        </div>
      </div>
    </div>
  );
};

export default Welcome;