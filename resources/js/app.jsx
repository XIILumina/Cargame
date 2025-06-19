import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import './app.css';

const App = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <div className="space-x-4">
            <InertiaLink href="/" className="hover:underline">Game</InertiaLink>
            <InertiaLink href="/leaderboard" className="hover:underline">Leaderboard</InertiaLink>
            <InertiaLink href="/hangar" className="hover:underline">Hangar</InertiaLink>
            <InertiaLink href="/profile" className="hover:underline">Profile</InertiaLink>
          </div>
          <div>
            <InertiaLink href="/login" className="hover:underline">Login</InertiaLink>
            <InertiaLink href="/register" className="ml-4 hover:underline">Register</InertiaLink>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default App;