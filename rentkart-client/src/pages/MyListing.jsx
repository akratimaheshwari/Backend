import React, { useState, useEffect } from 'react';
import {
  Edit3,
  Trash2,
  Eye,
  MapPin,
  DollarSign,
  Calendar,
  Package,
  MoreVertical,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MyListings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserItems();
  }, []);

  const fetchUserItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/items/owner`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) {
        throw new Error('Unauthorized');
      }
      const data = await res.json();
      setItems(data.items || data || []);
    } catch (err) {
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const res = await fetch(`/api/items/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isAvailable: !item.isAvailable })
      });
      const updated = await res.json();
      setItems(items.map(i => i._id === updated._id ? updated : i));
    } catch (err) {
      setError('Failed to update availability');
    }
  };

  const handleAddItemClick = () => {
    navigate('/add-item');
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddItemClick={handleAddItemClick} />
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">My Listings</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center text-gray-500">No listings found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item._id} className="bg-white rounded-xl shadow p-4">
                <div className="h-40 bg-gray-100 rounded mb-4">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full flex justify-center items-center text-gray-400">
                      <Package className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="text-sm text-gray-700 flex items-center gap-1 mb-1">
                  <MapPin className="w-4 h-4" /> {item.location}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-1 mb-1">
                  <DollarSign className="w-4 h-4" /> ₹{item.pricing?.per_day}/day
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-1 mb-1">
                  <Calendar className="w-4 h-4" /> {new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-1 mb-1">
                  <Clock className="w-4 h-4" /> {item.duration || 'N/A'}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-1 mb-1">
                  <MoreVertical className="w-4 h-4" /> Category: {item.category?.title || 'N/A'}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </button>

                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;


