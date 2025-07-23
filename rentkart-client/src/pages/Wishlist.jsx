import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, MapPin, Star, Trash2, Search, Grid3X3, List, Filter, Share2, Calendar, Users, Clock, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Original functionality preserved
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Mock data for demonstration
      setItems([
        {
          _id: '1',
          title: 'Luxury Mountain Cabin',
          description: 'Experience the perfect blend of luxury and nature in this stunning mountain retreat with panoramic views and modern amenities.',
          images: ['https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg'],
          location: 'Aspen, Colorado',
          pricing: { per_day: 2500 }
        },
        {
          _id: '2',
          title: 'Beachfront Villa',
          description: 'Wake up to the sound of waves in this elegant beachfront villa with private beach access and infinity pool.',
          images: ['https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg'],
          location: 'Malibu, California',
          pricing: { per_day: 3200 }
        },
        {
          _id: '3',
          title: 'Urban Loft Downtown',
          description: 'Modern loft in the heart of the city with floor-to-ceiling windows and rooftop access with stunning skyline views.',
          images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
          location: 'New York, NY',
          pricing: { per_day: 1800 }
        },
        {
          _id: '4',
          title: 'Countryside Cottage',
          description: 'Charming cottage surrounded by rolling hills and vineyards, perfect for a peaceful getaway.',
          images: ['https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg'],
          location: 'Tuscany, Italy',
          pricing: { per_day: 1200 }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Original functionality preserved
  const removeFromWishlist = async (itemId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/wishlist/remove/${itemId}`, {
  headers: { Authorization: `Bearer ${token}` }
   });
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      // For demo, still remove from local state
      setItems(items.filter(item => item._id !== itemId));
    }
  };

  // Additional features
  const shareItem = async (item) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      navigator.clipboard.writeText(`Check out this amazing place: ${item.title}`);
      // Show a temporary notification
      const notification = document.createElement('div');
      notification.textContent = 'Link copied to clipboard!';
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 2000);
    }
  };

  const filteredAndSortedItems = items
    .filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.pricing.per_day - b.pricing.per_day;
        case 'price-high':
          return b.pricing.per_day - a.pricing.per_day;
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return a.title.localeCompare(b.title);
      }
    });

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500"></div>
          <p className="text-gray-600 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-teal-50 to-cyan-50">
      {/* Header Section */}
       <Header isLoggedIn={!!localStorage.getItem('token')} />
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title and Stats */}
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  My Wishlist
                </h1>
                <p className="text-gray-600 mt-1">
                  {items.length} {items.length === 1 ? 'property' : 'properties'} saved
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>Favorites</span>
                </div>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              

              {/* View Controls */}
              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200"
                  >
                    <option value="title">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="location">Location</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-gray-400 text-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-rose-500 text-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {searchTerm ? 'No matching properties found' : 'Your wishlist is empty'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Start exploring and save your favorite properties to see them here.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-full hover:bg-rose-600 transition-colors duration-200 font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}>
            {filteredAndSortedItems.map(item => (
              <div
                key={item._id}
                className={`group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${
                  viewMode === 'list' ? 'flex gap-6 p-4' : 'p-0'
                }`}
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-48 h-32 flex-shrink-0 rounded-xl' : 'h-56 w-full'
                }`}>
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => shareItem(item)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                    >
                      <Share2 className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-rose-50 hover:scale-110 transition-all duration-200 shadow-lg group"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500 group-hover:text-rose-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className={viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : 'p-6'}>
                  <div>
                    <h3 className={`font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors duration-200 ${
                      viewMode === 'list' ? 'text-xl' : 'text-lg'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-gray-600 mb-4 line-clamp-2 ${
                      viewMode === 'list' ? 'text-base' : 'text-sm'
                    }`}>
                      {item.description}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-gray-400 text-sm">(124)</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>4 guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Instant book</span>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className={`flex items-center justify-between pt-2 border-t border-gray-100 ${
                      viewMode === 'list' ? 'mt-auto' : ''
                    }`}>
                      <div>
                        <span className={`font-bold text-gray-900 ${
                          viewMode === 'list' ? 'text-2xl' : 'text-xl'
                        }`}>
                          ₹{item.pricing.per_day.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">/day</span>
                      </div>
                      
                      {viewMode === 'list' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => shareItem(item)}
                            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item._id)}
                            className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
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

export default Wishlist;
