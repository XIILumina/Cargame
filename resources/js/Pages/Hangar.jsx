import React from 'react';
import { Inertia } from '@inertiajs/inertia';

const Hangar = ({ user, userCars, availableCars, parts }) => {
  const buyCar = (carId) => {
    Inertia.post('/hangar/buy-car', { car_id: carId });
  };

  const buyPart = (partId, carId) => {
    Inertia.post('/hangar/buy-part', { part_id: partId, car_id: carId });
  };

  const setActiveCar = (carId) => {
    Inertia.post('/hangar/set-active-car', { car_id: carId });
  };

  const changeColor = (carId, color) => {
    Inertia.post('/hangar/change-color', { car_id: carId, color });
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Hangar</h1>
      <p>Coins: {user?.coins || 0}</p>
      <h2 className="text-2xl font-semibold mt-4">Your Cars</h2>
      <div className="grid grid-cols-3 gap-4">
        {userCars.map(uc => (
          <div key={uc.id} className="border p-4">
            <p>{uc.car.name}</p>
            <img src={`/assets/cars/${uc.car.sprite_path}`} alt={uc.car.name} className="w-24 mx-auto" />
            <p>Color: <input type="color" value={uc.color} onChange={(e) => changeColor(uc.id, e.target.value)} /></p>
            <button
              onClick={() => setActiveCar(uc.id)}
              className={`px-4 py-2 ${uc.is_active ? 'bg-green-500' : 'bg-blue-500'} text-white rounded`}
            >
              {uc.is_active ? 'Active' : 'Set Active'}
            </button>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-semibold mt-4">Available Cars</h2>
      <div className="grid grid-cols-3 gap-4">
        {availableCars.map(c => (
          <div key={c.id} className="border p-4">
            <p>{c.name} - {c.cost} Coins</p>
            <img src={`/assets/cars/${c.sprite_path}`} alt={c.name} className="w-24 mx-auto" />
            <button onClick={() => buyCar(c.id)} className="px-4 py-2 bg-blue-500 text-white rounded">Buy</button>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-semibold mt-4">Parts Shop</h2>
      <div className="grid grid-cols-3 gap-4">
        {parts.map(p => (
          <div key={p.id} className="border p-4">
            <p>{p.name} ({p.type}) - {p.cost} Coins</p>
            <select onChange={(e) => buyPart(p.id, e.target.value)} className="border p-2">
              <option value="">Select Car</option>
              {userCars.map(uc => (
                <option key={uc.id} value={uc.id}>{uc.car.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hangar;