import React from 'react';

const Leaderboard = ({ stats }) => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Rank</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Coins</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr key={stat.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{stat.user.name}</td>
              <td className="border p-2">{stat.score}</td>
              <td className="border p-2">{stat.coins_earned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;