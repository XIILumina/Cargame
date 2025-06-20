import React from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function CarSelection({ cars }) {
  const handleSelect = (carId) => {
    Inertia.post('/game', { car_id: carId });
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-4">
      <h2 className="text-center text-3xl mb-6 font-bold">Choose Your Car</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {cars.map((userCar) => (
          <div
            key={userCar.id}
            className="bg-gray-700 p-4 rounded-lg hover:scale-105 transition cursor-pointer"
            onClick={() => handleSelect(userCar.id)}
          >
            <img src={`/assets/cars/${userCar.car.sprite_path}`} alt="car" className="w-32 h-20 mb-2" />
            <div className="text-center">{userCar.car.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
