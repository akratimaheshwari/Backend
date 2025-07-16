import React, { useEffect, useState } from 'react';
import RenterDashboard from '../components/RenterDashboard';
import OwnerDashboard from '../components/OwnerDashboard';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('renter');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return <div className="p-6 text-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.address}</p>
      </div>

      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => setActiveTab('renter')}
          className={`px-4 py-2 rounded ${
            activeTab === 'renter' ? 'bg-yellow-500 text-white' : 'bg-white shadow'
          }`}
        >
          Renter View
        </button>
        <button
          onClick={() => setActiveTab('owner')}
          className={`px-4 py-2 rounded ${
            activeTab === 'owner' ? 'bg-yellow-500 text-white' : 'bg-white shadow'
          }`}
        >
          Owner View
        </button>
      </div>

      {activeTab === 'renter' ? <RenterDashboard /> : <OwnerDashboard />}
    </div>
  );
};

export default UserDashboard;

