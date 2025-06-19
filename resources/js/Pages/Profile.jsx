import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const Profile = ({ user }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email });

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.post('/profile', form);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Update</button>
      </form>
    </div>
  );
};

export default Profile;