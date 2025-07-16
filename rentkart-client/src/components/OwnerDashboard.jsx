import React from 'react';

const OwnerDashboard = () => (
  <div className="grid md:grid-cols-2 gap-6">
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-3">My Listings</h2>
      <a href="/my-listings" className="text-blue-600 hover:underline">📦 View Listings</a>
    </div>
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-3">Add New Listing</h2>
      <a href="/add-item" className="text-green-600 hover:underline">➕ Add Item</a>
    </div>
  </div>
);

export default OwnerDashboard;
