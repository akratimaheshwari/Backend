import React from 'react';

const RenterDashboard = () => (
  <div className="grid md:grid-cols-2 gap-6">
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-3">My Orders</h2>
      <a href="/orders" className="text-blue-600 hover:underline">🛒 View Orders</a>
    </div>
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-3">My Wishlist</h2>
      <a href="/wishlist" className="text-blue-600 hover:underline">❤️ View Wishlist</a>
    </div>
  </div>
);

export default RenterDashboard;
