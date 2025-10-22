import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router-dom for navigation
import { Package, DollarSign, Eye, Calendar, TrendingUp, Star, Clock, MapPin } from 'lucide-react';

// Define the API endpoint
const API_BASE_URL = '/api/owner/dashboard'; 

// Define the expected structure for initial state
const initialDashboardData = {
    myListings: [],
    recentBookings: [],
    stats: {
        totalListings: 0,
        monthlyEarnings: 0,
        totalViews: 0,
        avgRating: 0,
    }
};

const OwnerDashboard = () => {
    const [data, setData] = useState(initialDashboardData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- Data Fetching Function ---
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required. Please log in.');
                setLoading(false);
                return;
            }

            const response = await axios.get(API_BASE_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData(response.data);
            
        } catch (err) {
            console.error('Error fetching owner dashboard data:', err);
            setError('Failed to load dashboard data. Check backend connection and user role.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // --- Data Transformation (Stats Grid) ---
    const dashboardStats = useMemo(() => [
        { 
            label: 'Total Listings', 
            value: data.stats.totalListings, 
            icon: Package, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50' 
        },
        { 
            label: 'Monthly Earnings', 
            value: `₹${data.stats.monthlyEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            icon: DollarSign, 
            color: 'text-green-600', 
            bg: 'bg-green-50' 
        },
        { 
            label: 'Total Views', 
            value: data.stats.totalViews.toLocaleString(), 
            icon: Eye, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50' 
        },
        { 
            label: 'Avg Rating', 
            value: data.stats.avgRating.toFixed(1), 
            icon: Star, 
            color: 'text-yellow-600', 
            bg: 'bg-yellow-50' 
        }
    ], [data.stats]);


    if (loading) {
        return <div className="p-8 text-center text-lg text-gray-500">Loading your owner dashboard...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-xl m-4 font-semibold">{error}</div>;
    }

    // --- Helper functions for rendering ---
    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'rented': return 'bg-red-100 text-red-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getBookingStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'active': return 'bg-blue-100 text-blue-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'returned': return 'bg-gray-200 text-gray-900';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };


    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Owner Dashboard 💼</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {dashboardStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={index} className="bg-white border border-gray-100 rounded-xl p-5 shadow-lg transition-transform hover:scale-[1.02]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-extrabold text-gray-800">{stat.value}</p>
                                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                                </div>
                                <div className={`${stat.bg} p-3 rounded-full`}>
                                    <IconComponent className={`w-7 h-7 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* My Listings */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <Package className="w-5 h-5 mr-2 text-blue-600" /> My Listings ({data.myListings.length})
                        </h3>
                        <button 
                            onClick={() => navigate('/add-item')} // Assuming a route to add an item
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                            Add New Item
                        </button>
                    </div>
                    <div className="space-y-4">
                        {data.myListings.length > 0 ? (
                            data.myListings.map((listing) => (
                                <div 
                                    key={listing.id} 
                                    className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/items/${listing.id}/edit`)} // Navigate to edit item page
                                >
                                    <div className="flex space-x-4 items-center">
                                        <img
                                            src={listing.image}
                                            alt={listing.title}
                                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg text-gray-900 truncate">{listing.title}</h4>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(listing.status)}`}>
                                                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{listing.category}</p>
                                            
                                            {/* Pricing Row */}
                                            <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600 mb-2 font-medium">
                                                <span className="text-green-700">₹{listing.dailyRate}/day</span>
                                                <span className="text-gray-500">₹{listing.weeklyRate}/week</span>
                                                <span className="text-gray-500">₹{listing.monthlyRate}/month</span>
                                            </div>
                                            
                                            {/* Views/Bookings Row */}
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <span className="flex items-center">
                                                    <Eye className="w-3 h-3 mr-1 text-purple-400" />
                                                    {listing.views} views
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1 text-blue-400" />
                                                    {listing.bookings} bookings
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 p-8 border border-dashed rounded-xl text-center bg-white">
                                <Package className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-semibold">You have no items listed yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-orange-600" /> Recent Bookings
                    </h3>
                    <div className="space-y-4">
                        {data.recentBookings.length > 0 ? (
                            data.recentBookings.map((booking) => (
                                <div key={booking.id} className="border border-gray-200 rounded-xl p-4 bg-white cursor-pointer hover:shadow-sm" onClick={() => navigate(`/owner/orders/${booking.orderId}`)}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-gray-800 text-base line-clamp-1">{booking.item}</h4>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBookingStatusColor(booking.status)}`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">by **{booking.renter}**</p>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {booking.startDate} - {booking.endDate}
                                        </div>
                                        <div className="flex items-center justify-between font-medium pt-1">
                                            <span className="flex items-center text-gray-800 text-sm">
                                                <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                                                ₹{booking.amount.toLocaleString('en-IN')} Total
                                            </span>
                                            <button className="text-blue-600 hover:text-blue-800">View</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 p-8 border border-dashed rounded-xl text-center bg-white">
                                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-semibold">No recent bookings yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
