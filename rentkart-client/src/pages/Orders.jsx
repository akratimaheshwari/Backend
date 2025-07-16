import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("Fetch failed:", res.status, text);
      alert("Something went wrong. Check console.");
      return;
    }

    // 🔐 Try to parse JSON safely
    let data = [];
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.warn("Empty or invalid JSON body");
      data = [];
    }

    setOrders(data);
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Something went wrong.");
  }
};


    fetchOrders();
  }, []);

  const handleReturn = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/returns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert("Return failed: " + errorText);
        return;
      }

      alert("Return requested successfully.");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "Return Requested" } : o
        )
      );
    } catch (err) {
      console.error("Return error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <OrderCard key={order._id} order={order} onReturn={handleReturn} />
        ))
      )}
    </div>
  );
};

export default Orders;
