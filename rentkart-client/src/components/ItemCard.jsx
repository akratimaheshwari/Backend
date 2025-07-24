import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Star, ShoppingCart, Eye } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
const ItemCard = ({ item, handleLike, onAddToCart }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rentalPeriod, setRentalPeriod] = useState('1 Day');

  useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const wishlistItems = await res.json();

      const isInWishlist = wishlistItems.some((wishItem) => {
        return wishItem._id === item._id;
      });

      setIsLiked(isInWishlist); // ✅ this sets ❤️ correctly after refresh
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  };

  fetchWishlist();
}, [item._id]);  // ✅ this will run only when the item changes

const toggleWishlist = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/wishlist/toggle/${item._id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      setIsLiked(prev => !prev); // toggle UI state
    } else {
      console.error("Failed to toggle wishlist");
    }
  } catch (err) {
    console.error("Error toggling wishlist:", err);
  }
};

const rentalMap = {
  '1 Day': 'per_day',
  '1 Week': 'per_week',
  '1 Month': 'per_month'
};
const addToCart = async () => {
  if (!startDate || !endDate || !rentalPeriod) {
    alert("Please select rental period and start date first.");
    return;
  }
  const mappedRentalType = rentalMap[rentalPeriod];
  try {
    const token = localStorage.getItem("token");
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        item_id: item._id,
        quantity: 1,
        rental_type: mappedRentalType,  // ✅ Corrected line
        rental_start_date: startDate,
        rental_end_date: endDate
      })
    });

    if (res.ok) {
      alert('Item added to cart successfully!');
    } else {
      alert('Failed to add to cart');
    }
  } catch (err) {
    console.error("Failed to add to cart:", err);
  }
};

const getDaysFromPeriod = (period) => {
  if (period === '1 Day') return 1;
  if (period === '1 Week') return 7;
  if (period === '1 Month') return 30;
  return 1;
};

const calculateEndDate = (startDate, daysToAdd) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0]; // format to 'YYYY-MM-DD'
};


const handleRentNow = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setShowModal(true);
};

return (
  <>
    <div
      className="group bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link to={`/items/${item._id}`}>
          <div className="relative overflow-hidden">
            <img
              src={item.images?.[0] || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600'}
              alt={item.title}
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist();
          }}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${isLiked
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-red-500'
            }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>


        {/* Quick Actions Overlay */}
        <div className={`absolute inset-x-4 bottom-4 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>


          <Link
            to={`/items/${item._id}`}
            className="bg-neutral-800/90 backdrop-blur-sm text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Available
          </span>
        </div>
      </div>

      <div className="p-6">
        <Link to={`/items/${item._id}`}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1 group-hover:text-neutral-700 transition-colors">
              {item.title}
            </h3>

            <div className="flex items-center gap-1 text-neutral-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{item.location}</span>
            </div>

            <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
              {item.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < (item.rating || 4)
                      ? 'text-yellow-400 fill-current'
                      : 'text-neutral-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-600">
                ({item.reviews || 12} reviews)
              </span>
            </div>
          </div>
        </Link>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-neutral-900">
              ₹{item.pricing?.per_day || item.price}
            </span>
            <span className="text-neutral-600 text-sm ml-1">/day</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-500 text-xs">
            <Calendar className="w-3 h-3" />
            <span>Min 1 day</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleRentNow}
            className="flex-1 bg-neutral-900 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            Rent Now
          </button>
          <button
            onClick={() => {
              addToCart(); // ✅ Correct function call
            }}
            className="p-2.5 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Like Count */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-1 text-neutral-500 text-sm">
            <Heart className="w-4 h-4" />
            <span>{item.likes || 0} likes</span>
          </div>
          <span className="text-xs text-neutral-400">
            Listed 2 days ago
          </span>
        </div>
      </div>
    </div>

    {/* Rent Now Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Rent {item.title}
            </h3>
            <p className="text-neutral-600">
              Choose your rental period and confirm booking
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Rental Period
              </label>
              <select
                value={rentalPeriod}
                onChange={(e) => {
                  setRentalPeriod(e.target.value);
                  if (startDate) {
                    const daysToAdd = getDaysFromPeriod(e.target.value);
                    const newEndDate = calculateEndDate(startDate, daysToAdd);
                    setEndDate(newEndDate);
                  }
                }}
                className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              >
                <option>1 Day</option>
                <option>1 Week</option>
                <option>1 Month</option>
              </select>

            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    setStartDate(selectedDate);

                    const daysToAdd = getDaysFromPeriod(rentalPeriod);
                    const newEndDate = calculateEndDate(selectedDate, daysToAdd);
                    setEndDate(newEndDate);
                  }}
                  className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />

              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  readOnly
                  className="w-full p-3 border border-neutral-200 rounded-lg bg-gray-100 text-neutral-500 cursor-not-allowed"
                />

              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                addToCart(); // ✅ no parameter needed
                setShowModal(false);
              }}

              className="flex-1 px-4 py-3 bg-neutral-900 text-white ...">
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
};

export default ItemCard;