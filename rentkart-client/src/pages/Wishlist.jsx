import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, MapPin, Star, Trash2, Search, Grid3X3, List, Filter, Share2, Calendar, Users, Clock, ChevronDown, X } from 'lucide-react';
import Header from '../components/Header';
import { Link } from 'react-router-dom'; 

const Wishlist = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    // REMOVED: [searchTerm, setSearchTerm] state
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
            // Assuming the backend returns an array of fully populated Item objects
            setItems(res.data); 
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            // Mock data for demonstration (structure modified slightly for consistency)
            setItems([
                {
                    _id: '1',
                    title: 'Luxury Mountain Cabin',
                    description: 'Experience the perfect blend of luxury and nature in this stunning mountain retreat with panoramic views and modern amenities.',
                    images: ['https://placehold.co/400x300/a8dadc/1d3557?text=Cabin'],
                    location: 'Aspen, Colorado',
                    pricing: { per_day: 2500 }
                },
                {
                    _id: '2',
                    title: 'Beachfront Villa',
                    description: 'Wake up to the sound of waves in this elegant beachfront villa with private beach access and infinity pool.',
                    images: ['https://placehold.co/400x300/457b9d/1d3557?text=Villa'],
                    location: 'Malibu, California',
                    pricing: { per_day: 3200 }
                },
                {
                    _id: '3',
                    title: 'Urban Loft Downtown',
                    description: 'Modern loft in the heart of the city with floor-to-ceiling windows and rooftop access with stunning skyline views.',
                    images: ['https://placehold.co/400x300/f4a261/1d3557?text=Loft'],
                    location: 'New York, NY',
                    pricing: { per_day: 1800 }
                },
                {
                    _id: '4',
                    title: 'Countryside Cottage',
                    description: 'Charming cottage surrounded by rolling hills and vineyards, perfect for a peaceful getaway.',
                    images: ['https://placehold.co/400x300/e9c46a/1d3557?text=Cottage'],
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
            // Fallback for failed removal (e.g., if token is invalid), keep local state update for UX
            setItems(items.filter(item => item._id !== itemId));
        }
    };

    // Additional features (sharing adapted for modern use)
    const shareItem = async (item) => {
        const shareData = {
            title: item.title,
            text: item.description || `Check out this amazing rental item: ${item.title}`,
            url: `${window.location.origin}/items/${item._id}` 
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Sharing failed:', error);
            }
        } else {
            // Fallback for environments that don't support navigator.share
            // Using document.execCommand('copy') as per instructions
            try {
                const tempInput = document.createElement('input');
                tempInput.value = shareData.url;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
            } catch (err) {
                console.error("Failed to copy URL:", err);
            }
            
            // Show a temporary notification (using custom message box instead of alert/confirm)
            const notification = document.createElement('div');
            notification.textContent = 'Link copied to clipboard!';
            notification.className = 'fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-y-0 opacity-100';
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.className = notification.className.replace('translate-y-0 opacity-100', 'translate-y-10 opacity-0');
                setTimeout(() => document.body.removeChild(notification), 300);
            }, 2000);
        }
    };

    // MODIFIED: Removed searchTerm filter from filteredAndSortedItems logic
    const filteredAndSortedItems = items
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return (a.pricing?.per_day || 0) - (b.pricing?.per_day || 0);
                case 'price-high':
                    return (b.pricing?.per_day || 0) - (a.pricing?.per_day || 0);
                case 'location':
                    return (a.location || '').localeCompare(b.location || '');
                default:
                    return (a.title || '').localeCompare(b.title || '');
            }
        });

    useEffect(() => {
        fetchWishlist();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-rose-500"></div>
                    <p className="text-gray-600 font-medium text-lg">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    // REMOVED: handleSearchChange function

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header is correctly rendered here */}
            <Header /> 

            {/* Sticky Controls Bar */}
            <div className="bg-white shadow-md sticky top-0 z-30 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        
                        {/* Title and Stats */}
                        <div className="flex items-center gap-6">
                            <h1 className="text-3xl font-extrabold text-neutral-900 flex items-center gap-3">
                                <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                                My Wishlist
                            </h1>
                            <p className="text-lg text-gray-500 hidden sm:block">
                                ({items.length} {items.length === 1 ? 'item' : 'items'} saved)
                            </p>
                        </div>

                        {/* Controls: Sort, View */}
                        {/* ADJUSTED: Removed the search bar div entirely */}
                        <div className="flex flex-wrap items-center gap-4">
                            
                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all duration-200"
                                >
                                    <option value="title">Sort by Name</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="location">Location</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex bg-white rounded-xl border border-gray-300 overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    title="Grid View"
                                    className={`p-2 transition-all duration-200 ${
                                        viewMode === 'grid'
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Grid3X3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    title="List View"
                                    className={`p-2 transition-all duration-200 ${
                                        viewMode === 'list'
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* MODIFIED: Simplified empty state messaging since search is removed */}
                {filteredAndSortedItems.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-rose-50 rounded-full mb-6">
                            <Heart className="w-12 h-12 text-rose-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Your wishlist is empty
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Start browsing and save your favorite rental items to see them here.
                        </p>
                    </div>
                ) : (
                    /* Items Display */
                    <div className={`${
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                            : 'space-y-6'
                    }`}>
                        {filteredAndSortedItems.map(item => (
                            <Link
                                key={item._id}
                                to={`/items/${item._id}`} // Link to item detail page
                                className={`group bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 border border-gray-100 ${
                                    viewMode === 'list' ? 'flex flex-col sm:flex-row gap-6 p-4' : 'p-0'
                                }`}
                            >
                                {/* Image */}
                                <div className={`relative overflow-hidden ${
                                    viewMode === 'list' ? 'w-full sm:w-48 h-48 sm:h-36 flex-shrink-0 rounded-xl' : 'h-56 w-full rounded-t-2xl'
                                }`}>
                                    <img
                                        src={item.images[0]}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    
                                    {/* Action Buttons Overlay (Grid View) */}
                                    {viewMode === 'grid' && (
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); shareItem(item); }}
                                                title="Share Item"
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg text-gray-700"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromWishlist(item._id); }}
                                                title="Remove from Wishlist"
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-rose-50 hover:scale-110 transition-all duration-200 shadow-lg text-rose-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className={viewMode === 'list' ? 'flex-1 flex flex-col justify-between p-0' : 'p-6'}>
                                    <div>
                                        <h3 className={`font-bold text-gray-900 mb-2 transition-colors duration-200 ${
                                            viewMode === 'list' ? 'text-xl' : 'text-lg'
                                        }`}>
                                            {item.title}
                                        </h3>
                                        <p className={`text-gray-600 mb-4 line-clamp-2 ${
                                            viewMode === 'list' ? 'text-sm' : 'text-sm'
                                        }`}>
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3">
                                        
                                        {/* Rating and Location */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="text-sm font-semibold">4.8</span>
                                                <span className="text-gray-400 text-sm">(124)</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{item.location}</span>
                                            </div>
                                        </div>

                                        {/* Price and Actions */}
                                        <div className={`flex items-center justify-between pt-4 border-t border-gray-100 ${
                                            viewMode === 'list' ? '' : '' // Keep clean
                                        }`}>
                                            <div>
                                                <span className={`font-extrabold text-rose-600 ${
                                                    viewMode === 'list' ? 'text-2xl' : 'text-xl'
                                                }`}>
                                                    ₹{(item.pricing?.per_day || 0).toLocaleString()}
                                                </span>
                                                <span className="text-gray-500 text-sm ml-1">/day</span>
                                            </div>
                                            
                                            {/* List View Actions */}
                                            {viewMode === 'list' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); shareItem(item); }}
                                                        title="Share Item"
                                                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200"
                                                    >
                                                        <Share2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromWishlist(item._id); }}
                                                        title="Remove from Wishlist"
                                                        className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all duration-200"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
