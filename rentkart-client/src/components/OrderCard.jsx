import React, { useState } from "react";
import {
  RotateCcw,
  Star,
  MessageSquareText,
  User,
  Percent,
  Plus,
  Minus,
  PackageSearch,
  XCircle,
  FileText,
  Truck,
  Heart,
  Info
} from "lucide-react";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  "Return Requested": "bg-purple-100 text-purple-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderCard = ({ order, onReturn, onAddCoupon, onQuantityChange, onCancelOrder, onTrackOrder, onDownloadInvoice }) => {
  const statusStyle = statusColors[order.status] || "bg-gray-100 text-gray-700";
  const [quantity, setQuantity] = useState(order.quantity || 1);
  const [couponCode, setCouponCode] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    onQuantityChange?.(order._id, newQuantity);
  };

  const renderTrackingBar = () => {
    const steps = ["Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"];
    const currentStepIndex = steps.findIndex(step => step === order.status);

    return (
      <div className="flex items-center justify-between mt-4">
        {steps.map((step, index) => (
          <div key={step} className="flex-1 flex items-center">
            <div
              className={w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold text-white z-10 ${index <= currentStepIndex ? "bg-green-500" : "bg-gray-300"}}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={flex-1 h-1 ${index < currentStepIndex ? "bg-green-500" : "bg-gray-300"}}></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const getRemainingDays = () => {
    const today = new Date();
    const deliveryDate = new Date(order.delivery_date);
    const diff = deliveryDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const renderRating = () => {
    return (
      <div className="flex items-center gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={w-5 h-5 cursor-pointer transition-transform duration-200 ${
              (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
            } hover:scale-125}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            fill={(hoverRating || rating) >= star ? "#FACC15" : "none"}
          />
        ))}
        <span className="text-sm ml-2 text-gray-600">{rating > 0 ? ${rating} Stars : "Rate Item"}</span>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg mb-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative group">
          <img
            src={order.item.image}
            alt={order.item.name}
            className="w-36 h-36 object-cover rounded-xl border hover:scale-110 transition-transform duration-500 shadow-md"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Image
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <User className="w-4 h-4 text-blue-500" /> Order by: <span className="font-medium">{order.user?.name || "Anonymous"}</span>
          </div>

          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight hover:text-blue-600 transition-colors duration-300 cursor-pointer" onClick={() => setExpanded(!expanded)}>
            {order.item.name}
            <span className="ml-2 text-xs text-blue-500">[{expanded ? "Less" : "More"}]</span>
          </h3>

          {expanded && (
            <div className="space-y-1 text-sm text-gray-600">
              <p>Description: <span className="text-black font-medium">{order.item.description || "No description provided."}</span></p>
              <p>Category: <span className="text-black font-medium">{order.item.category || "Miscellaneous"}</span></p>
              <p>Rental Duration: <span className="font-medium text-black">{order.duration} days</span></p>
              <p>Delivery Date: <span className="font-semibold text-black">{new Date(order.delivery_date).toLocaleDateString()}</span></p>
              <p>Estimated Arrival In: <span className="text-green-700 font-semibold">{getRemainingDays()} days</span></p>
              <p>Delivery Slot: <span className="text-black font-medium">{order.delivery_slot}</span></p>
              <p>Total: <span className="font-semibold text-black">₹{order.totalAmount}</span></p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <button onClick={() => handleQuantityChange(-1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium">{quantity}</span>
            <button onClick={() => handleQuantityChange(1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {renderRating()}

          <div className={inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${statusStyle} mt-2 shadow-sm transition-all duration-300}>
            {order.status}
          </div>

          {renderTrackingBar()}

          <div className="flex flex-wrap gap-3 mt-4">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-100 transition">
              <Star className="w-4 h-4" /> Rate Item
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition">
              <MessageSquareText className="w-4 h-4" /> Contact Seller
            </button>
            <button onClick={() => onTrackOrder?.(order._id)} className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs hover:bg-yellow-200 transition">
              <PackageSearch className="w-4 h-4" /> Track Order
            </button>
            <button onClick={() => onDownloadInvoice?.(order._id)} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs hover:bg-indigo-200 transition">
              <FileText className="w-4 h-4" /> Invoice
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full text-xs hover:bg-pink-200 transition">
              <Heart className="w-4 h-4" /> Save for Later
            </button>
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
              <button onClick={() => onCancelOrder?.(order._id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs hover:bg-red-200 transition">
                <XCircle className="w-4 h-4" /> Cancel Order
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border rounded-full px-4 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={() => onAddCoupon?.(order._id, couponCode)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition"
            >
              <Percent className="w-4 h-4" /> Apply Coupon
            </button>
          </div>
        </div>
      </div>

      {order.status === "Delivered" && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onReturn(order._id)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-4 h-4" />
            Request Return
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
