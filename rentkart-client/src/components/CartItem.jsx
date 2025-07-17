import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';

const CartItem = ({ item, onDelete, onQuantityChange }) => {
  const handleQuantityChange = (newQty) => {
    if (newQty > 0) {
      onQuantityChange(item._id, newQty);
    }
  };

  const handleInputBlur = (e) => {
    const newQty = parseInt(e.target.value);
    if (newQty > 0) {
      onQuantityChange(item._id, newQty);
    } else {
      e.target.value = item.quantity.toString();
    }
  };

  const totalPrice = (item.pricing?.per_day || 0) * item.quantity;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={item.images?.[0] || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={item.title}
            className="w-24 h-24 rounded-xl object-cover border border-neutral-100"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-neutral-900 mb-1 truncate">
            {item.title}
          </h3>
          <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
            {item.description}
          </p>
          <div className="text-lg font-bold text-neutral-900">
            ₹{totalPrice.toLocaleString()}
            <span className="text-sm font-normal text-neutral-500 ml-1">
              (₹{item.pricing?.per_day || 0}/day)
            </span>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-50 rounded-lg border border-neutral-200">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-2 hover:bg-neutral-100 transition-colors rounded-l-lg"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4 text-neutral-600" />
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              onBlur={handleInputBlur}
              min="1"
              className="w-16 text-center py-2 bg-transparent border-none focus:outline-none text-neutral-900 font-medium"
            />
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-2 hover:bg-neutral-100 transition-colors rounded-r-lg"
            >
              <Plus className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onDelete(item._id)}
          className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
          title="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
