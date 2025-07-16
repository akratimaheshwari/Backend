import React from "react";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  "Return Requested": "bg-purple-100 text-purple-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderCard = ({ order, onReturn }) => {
  const statusStyle = statusColors[order.status] || "bg-gray-100 text-gray-700";

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 mb-4">
      <div className="flex items-center space-x-4">
        <img
          src={order.item.image}
          alt={order.item.name}
          className="w-24 h-24 rounded object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{order.item.name}</h3>
          <p>Rental Duration: {order.duration} days</p>
          <p>Total: ₹{order.totalAmount}</p>
          <div className={`inline-block px-3 py-1 mt-2 rounded text-sm font-medium ${statusStyle}`}>
            {order.status}
          </div>
        </div>
      </div>

      {order.status === "Delivered" && (
        <button
          onClick={() => onReturn(order._id)}
          className="mt-3 px-4 py-2 bg-red-500 text-white rounded"
        >
          Request Return
        </button>
      )}
    </div>
  );
};

export default OrderCard;
