import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; // 🔑 IMPORTED useNavigate
import { Calendar, Clock, MapPin, Star, Package, Heart, History, DollarSign, ListOrdered } from 'lucide-react';

// Define the API endpoint (MUST match your backend route)
const API_BASE_URL = '/api/renter/dashboard'; 

// Define the initial state structure expected from the backend
const initialDashboardData = {
    activeRentals: [],
    rentalHistory: [],
    wishlist: [],
    stats: {
        activeRentalsCount: 0,
        totalSpent: 0,
        itemsRentedCount: 0,
        avgRating: 0,
    }
};

const RenterDashboard = () => {
    const [data, setData] = useState(initialDashboardData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // 🔑 INITIALIZED useNavigate

    // --- Data Fetching Function ---
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Retrieve the authentication token (essential for user-specific data)
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

            // Set the fetched data into the state
            setData(response.data);
            
        } catch (err) {
            console.error('Error fetching renter dashboard data:', err);
            // Handling specific errors for feedback
            if (err.response && err.response.status === 404) {
                 setError(`Dashboard data route not found: ${API_BASE_URL}. Check backend configuration.`);
            } else if (err.response && err.response.status === 500) {
                 setError('Server error loading dashboard. Check backend logs for crash details.');
            } else {
                 setError('Failed to load dashboard data. Please check your network connection.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to run the fetch function on component mount
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // --- Data Transformation (for the Stats Grid) ---
    const dashboardStats = useMemo(() => [
        { 
            label: 'Active Rentals', 
            value: data.stats.activeRentalsCount, 
            icon: Package, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50' 
        },
        { 
            label: 'Total Spent', 
            // Ensures currency formatting
            value: `₹${data.stats.totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            icon: DollarSign, 
            color: 'text-green-600', 
            bg: 'bg-green-50' 
        },
        { 
            label: 'Items Rented', 
            value: data.stats.itemsRentedCount, 
            icon: ListOrdered, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50' 
        },
        { 
            label: 'Avg Rating', 
            // Formats rating to one decimal place
            value: data.stats.avgRating.toFixed(1), 
            icon: Star, 
            color: 'text-yellow-600', 
            bg: 'bg-yellow-50' 
        }
    ], [data.stats]);


    // --- Conditional Rendering ---
    if (loading) {
        return <div className="p-8 text-center text-lg text-gray-500">Loading your dashboard...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-xl m-4 font-semibold">{error}</div>;
    }


    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved':
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Return Requested': return 'bg-orange-100 text-orange-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    // --- Render Component with Fetched Data ---
    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Renter Dashboard 👋</h1>
            
            {/* --- 1. Stats Grid --- */}
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
                
                {/* --- 2. Active Rentals --- */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                        <Package className="w-6 h-6 mr-2 text-blue-600" /> Current Rentals
                    </h3>
                    <div className="space-y-4">
                        {data.activeRentals.length > 0 ? (
                            data.activeRentals.map((rental) => (
                                <div key={rental.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex space-x-4 items-center">
                                        <img
                                            src={rental.image}
                                            alt={rental.item}
                                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-lg text-gray-900 truncate">{rental.item}</h4>
                                            {/* RENDER OWNER */}
                                            <p className="text-sm text-gray-600 mb-2">Owner: {rental.owner}</p> 
                                            <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4">
                                                <span className="flex items-center font-medium">
                                                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                    {rental.startDate} - {rental.endDate}
                                                </span>
                                                <span className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                    {rental.location}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end space-y-2">
                                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(rental.status)}`}>
                                                {rental.status}
                                            </span>
                                            <p className="font-extrabold text-lg text-green-700">₹{rental.dailyRate}/day</p>
                                            {/* 🔑 ACTIVE RENTALS: "View Details" goes to Order Details */}
                                            <button 
                                                onClick={() => navigate(`/orders/${rental.orderId}`)} 
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                             <div className="text-gray-500 p-8 border border-dashed rounded-xl text-center bg-white">
                                <Package className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-semibold">You have no active rentals.</p>
                             </div>
                        )}
                    </div>
                </div>

                {/* --- 3. Wishlist / Saved Items --- */}
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                        <Heart className="w-6 h-6 mr-2 text-red-500 fill-red-500" /> Your Wishlist
                    </h3>
                    <div className="space-y-3 p-4 bg-white rounded-xl shadow-md border border-gray-200">
                        {data.wishlist.length > 0 ? (
                            data.wishlist.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                    <div>
                                        <p className="font-medium text-gray-800">{item.item}</p>
                                        <div className="text-xs text-gray-500 flex items-center space-x-2 mt-0.5">
                                            <MapPin className="w-3 h-3" />
                                            <span>{item.location}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm text-gray-700">₹{item.dailyRate}/day</p>
                                        {/* 🔑 WISHLIST: "Rent It" goes to Item Details */}
                                        <button 
                                            onClick={() => navigate(`/items/${item.id}`)}
                                            className="text-xs text-emerald-600 hover:text-emerald-800 mt-0.5"
                                        >
                                            Rent It
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center text-sm">Nothing saved yet! Start browsing.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* --- 4. Rental History --- */}
            <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                    <History className="w-6 h-6 mr-2 text-orange-600" /> Rental History
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.rentalHistory.length > 0 ? (
                        data.rentalHistory.map((history) => (
                            <div key={history.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex space-x-4">
                                <img
                                    src={history.image}
                                    alt={history.item}
                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800">{history.item}</h4>
                                    <p className="text-sm text-gray-500 mb-1">{history.dates}</p>
                                    <div className="flex items-center text-sm">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="ml-1 text-gray-700">{history.rating} / 5</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {/* RENDER TOTAL AMOUNT */}
                                    <p className="font-extrabold text-lg text-red-600">Total: ₹{history.totalAmount.toLocaleString('en-IN')}</p>
                                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-1">Leave Review</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="md:col-span-2 text-gray-500 p-8 border border-dashed rounded-xl text-center bg-white">
                            <History className="w-8 h-8 mx-auto mb-2" />
                            <p className="font-semibold">No past rentals to show.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RenterDashboard;
