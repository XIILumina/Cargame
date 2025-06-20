import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';

const Navbar = ({ canLogin, canRegister }) => {
  return (
    <nav className="bg-blue-900 p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Speed Rush</div>
        <div className="space-x-4">
          <InertiaLink href="/" className="text-white hover:text-blue-300">Home</InertiaLink>
          <InertiaLink href="/leaderboard" className="text-white hover:text-blue-300">Leaderboard</InertiaLink>
          {canLogin && (
            <InertiaLink href="/login" className="text-white hover:text-blue-300">Login</InertiaLink>
          )}
          {canRegister && (
            <InertiaLink href="/register" className="text-white hover:text-blue-300">Register</InertiaLink>
          )}
          {canLogin && (
            <InertiaLink href="/hangar" className="text-white hover:text-blue-300">Hangar</InertiaLink>
          )}
          {canLogin && (
            <InertiaLink href="/profile" className="text-white hover:text-blue-300">Profile</InertiaLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;