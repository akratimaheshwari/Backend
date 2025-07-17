import React, { useEffect, useState } from "react";

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOwnerOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("api/orders/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Owner orders error:", errorText);
          alert("Failed to load owner orders.");
          return;
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Something went wrong.");
      }
    };

    fetchOwnerOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">My Listings - Rent History</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No rentals for your items yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={order.item.image}
                  alt={order.item.name}
                  className="w-24 h-24 rounded object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{order.item.name}</h3>
                  <p>Rented for: {order.duration} days</p>
                  <p>Total: ₹{order.totalAmount}</p>
                  <p>Status: <span className="font-medium">{order.status}</span></p>
                </div>
              </div>
              <div className="text-sm text-right">
                <p className="font-semibold text-gray-700">Renter Info:</p>
                <p>Name: {order.renter_id.name}</p>
                <p>Email: {order.renter_id.email}</p>
                <p>Phone: {order.renter_id.phone}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OwnerOrders;

