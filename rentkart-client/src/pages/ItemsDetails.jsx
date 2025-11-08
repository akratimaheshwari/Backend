import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { requireAuth } from '../utils/authUtils';
import axios from 'axios';
// 💡 IMPORT THE HEADER COMPONENT
import Header from '../components/Header'; 

import {
  ArrowLeft, MapPin, Calendar, Star, Heart, Share2, Shield, Clock, User, 
  MessageCircle, ShoppingCart, CheckCircle, AlertCircle, ThumbsUp, 
  ThumbsDown, Send, Filter, ChevronDown, Award, Verified, TrendingUp, Bell, Menu, X 
} from 'lucide-react';
import "react-responsive-carousel/lib/styles/carousel.min.css";


const ItemDetails = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('day');
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [likedItems, setLikedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Review states
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [reviewFilter, setReviewFilter] = useState('all');
    const [sortReviews, setSortReviews] = useState('newest');
    
    const [isLiked, setIsLiked] = useState(false);

    // 💡 REQUIRED STATES FOR THE REUSABLE HEADER (even if unused on this page)
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const isLoggedIn = !!localStorage.getItem("token"); // Determine login status for Header

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);

                // Fetch item
                const itemRes = await fetch(`/api/items/${id}`);
                const itemData = await itemRes.json();
                setItem(itemData);

                // Fetch wishlist
                const token = localStorage.getItem("token");
                const wishlistRes = await fetch('/api/wishlist', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const wishlist = await wishlistRes.json();
                // Check if the current item is in the user's wishlist
                const isItemLiked = wishlist.some(w => w._id === id); 
                setIsLiked(isItemLiked);

                // Fetch reviews
                const reviewsRes = await fetch(`/api/items/${id}/reviews`);
                if (reviewsRes.ok) {
                    const reviewData = await reviewsRes.json();
                    setReviews(reviewData);
                }
            } catch (err) {
                console.error("Error fetching item/wishlist/reviews:", err);
            } finally {
                setLoading(false);
                setReviewsLoading(false);
            }
        };

        fetchAll();
    }, [id]);


    const getAutoEndDate = (startDate, rentalType) => {
        if (!startDate || !rentalType) return '';
        const start = new Date(startDate);
        let daysToAdd = 1;
        if (rentalType === 'day') daysToAdd = 1;
        else if (rentalType === 'week') daysToAdd = 7;
        else if (rentalType === 'month') daysToAdd = 30;
        const end = new Date(start);
        end.setDate(start.getDate() + daysToAdd);
        return end.toISOString().split('T')[0];
    };

    const handleAddToCart = async () => {
        if (!requireAuth(navigate)) return;
        try {
            const token = localStorage.getItem('token');
            const checkRes = await fetch('/api/items/check-availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    item_id: item._id,
                    rental_start_date: startDate,
                    rental_end_date: endDate,
                }),
            });

            const checkData = await checkRes.json();
            if (!checkData.available) {
                alert(checkData.message || 'Item not available for selected dates');
                return;
            }

            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    item_id: item._id,
                    quantity: quantity,
                    rental_type: `per_${selectedPeriod}`,
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

    const handleSubmitReview = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/items/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newReview)
            });

            if (res.ok) {
                const review = await res.json();
                setReviews(prev => [review, ...prev]);
                setNewReview({ rating: 5, comment: '' });
                setShowReviewForm(false);
                alert('Review submitted successfully!');
            } else {
                alert('Failed to submit review');
            }
        } catch (err) {
            console.error("Failed to submit review:", err);
        }
    };

    const handleReviewHelpful = async (reviewId, isHelpful) => {
        if (!requireAuth(navigate)) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ helpful: isHelpful })
            });

            if (res.ok) {
                setReviews(prev => prev.map(review =>
                    review._id === reviewId
                        ? { ...review, helpfulCount: (review.helpfulCount || 0) + (isHelpful ? 1 : -1) }
                        : review
                ));
            }
        } catch (err) {
            console.error("Failed to mark review as helpful:", err);
        }
    };

    const calculatePrice = () => {
        const basePrice = item?.pricing?.[`per_${selectedPeriod}`] || item?.price || 0;
        return basePrice * quantity;
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
    };

    const filteredAndSortedReviews = reviews
        .filter(review => {
            if (reviewFilter === 'all') return true;
            return review.rating === parseInt(reviewFilter);
        })
        .sort((a, b) => {
            switch (sortReviews) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'rating-high':
                    return b.rating - a.rating;
                case 'rating-low':
                    return a.rating - b.rating;
                case 'helpful':
                    return (b.helpfulCount || 0) - (a.helpfulCount || 0);
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
    const toggleWishlist = async () => {
        if (!requireAuth(navigate)) return;
        const token = localStorage.getItem("token");
        await fetch(`/api/wishlist/toggle/${id}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        setIsLiked(prev => !prev);
    };

    const handleUserClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            // ✅ Redirect to user dashboard or profile
            navigate('/dashboard');
        } else {
            // 🔒 Not logged in → redirect to login
            navigate('/login');
        }
    };

    const features = [
        { icon: Shield, text: "Verified Owner", color: "bg-blue-100 text-blue-600" },
        { icon: CheckCircle, text: "Quality Guaranteed", color: "bg-green-100 text-green-600" },
        { icon: Clock, text: "24/7 Support", color: "bg-purple-100 text-purple-600" },
        { icon: AlertCircle, text: "Damage Protection", color: "bg-orange-100 text-orange-600" }
    ];

    if (loading) {
        // ... (Loading state JSX remains the same)
        return (
            <div className="min-h-screen bg-neutral-50">
              {/* 💡 RENDER HEADER IN LOADING STATE TOO, PASSING DUMMY STATES */}
              <Header location={''} setLocation={()=>{}} search={''} setSearch={()=>{}} isLoggedIn={isLoggedIn} />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse space-y-8">
                  <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-96 bg-neutral-200 rounded-2xl"></div>
                    <div className="space-y-4">
                      <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
                      <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                      <div className="h-32 bg-neutral-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
    }

    if (!item) {
        // ... (Item not found JSX remains the same)
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Item not found</h2>
                <p className="text-neutral-600 mb-6">The item you're looking for doesn't exist.</p>
                <Link
                  to="/items"
                  className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                >
                  Browse All Items
                </Link>
              </div>
            </div>
        );
    }

    const averageRating = calculateAverageRating();
    const ratingDistribution = getRatingDistribution();

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* 💡 REPLACEMENT: Use the imported Header component */}
            <Header 
                location={location} 
                setLocation={setLocation} 
                search={search} 
                setSearch={setSearch} 
                isLoggedIn={isLoggedIn} 
            />
            {/* 💡 END HEADER REPLACEMENT */}


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Image Gallery */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* ... (Image Carousel and other features content remains the same) ... */}
                        
                        <div className="relative">
                            <div className="relative">
                                <Carousel
                                    showThumbs={true}
                                    infiniteLoop
                                    autoPlay
                                    showStatus={false}
                                    className="rounded-2xl overflow-hidden shadow-lg"
                                    renderThumbs={() =>
                                        item.images?.map((img, index) => (
                                            <div key={index} className="h-16 w-16 rounded-md overflow-hidden border border-gray-200">
                                                <img
                                                    src={img}
                                                    alt={`Thumb ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ))
                                    }
                                >
                                    {item.images && item.images.length > 0 ? (
                                        item.images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="h-[350px] flex items-center justify-center bg-white"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${item.title} - Image ${index + 1}`}
                                                    className="max-h-full w-auto object-contain"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-[250px] flex items-center justify-center bg-gray-100">
                                            <img
                                                src="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800"
                                                alt={item.title}
                                                className="max-h-full w-auto object-contain"
                                            />
                                        </div>
                                    )}
                                </Carousel>
                            </div>


                            {/* Action Buttons Overlay - Adjusted heart button position */}
                            <div className="absolute top-4 right-4 flex gap-2 z-10"> 
                                {/* Heart Button */}
                                <button
                                    onClick={toggleWishlist}
                                    className={`p-3 rounded-full transition ${isLiked ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                </button>
                                {/* Share Button */}
                                <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm text-neutral-600 hover:bg-white transition-all shadow-lg">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>


                            {/* Availability Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-green-500 text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-lg">
                                    Available Now
                                </span>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center`}>
                                            <feature.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-neutral-700">{feature.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Item Details */}
                        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                            {/* ... (Item title, rating, description, and owner info) ... */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-neutral-900 mb-3">{item.title}</h1>
                                    <div className="flex items-center gap-6 text-neutral-600 mb-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{item.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="font-medium">{averageRating}</span>
                                            <span className="text-sm">({reviews.length} reviews)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" />
                                            <span className="text-sm">Popular choice</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-neutral-700 leading-relaxed mb-6">{item.description}</p>

                            {/* Owner Info */}
                            {item.owner_id && (
                                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-neutral-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-neutral-900">
                                                    {item?.owner?.name || 'Owner'}
                                                </h3>
                                                <Verified className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <p className="text-sm text-neutral-600">
                                                Member since {item?.owner?.createdAt ? new Date(item.owner.createdAt).getFullYear() : '2022'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-medium">4.9</span>
                                            </div>
                                            <button className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1">
                                                <MessageCircle className="w-3 h-3" />
                                                Contact
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm sticky top-24">
                            {/* ... (Booking and Review section content remains the same) ... */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Book This Item</h3>

                                {/* Period Selection */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {['day', 'week', 'month'].map(period => (
                                        <button
                                            key={period}
                                            onClick={() => setSelectedPeriod(period)}
                                            className={`p-3 rounded-lg border text-center transition-all ${selectedPeriod === period
                                                ? 'border-neutral-900 bg-neutral-900 text-white'
                                                : 'border-neutral-200 hover:border-neutral-300'
                                                }`}
                                        >
                                            <div className="text-sm font-medium capitalize">{period}</div>
                                            <div className="text-xs opacity-75">
                                                ₹{item.pricing?.[`per_${period}`] || item.price}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Quantity */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 border border-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-50 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 border border-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-50 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Date Selection */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => {
                                                const selectedStart = e.target.value;
                                                const autoEnd = getAutoEndDate(selectedStart, selectedPeriod);
                                                setStartDate(selectedStart);
                                                setEndDate(autoEnd);
                                            }}
                                            min={new Date().toISOString().split('T')[0]}
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
                                            onChange={(e) => setEndDate(e.target.value)}
                                            min={startDate}
                                            className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="border-t border-neutral-200 pt-4 mb-6">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-neutral-600">
                                            ₹{item.pricing?.[`per_${selectedPeriod}`] || item.price} × {quantity} {selectedPeriod}(s)
                                        </span>
                                        <span className="font-medium">₹{calculatePrice().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-neutral-600">Service fee</span>
                                        <span className="font-medium">₹{Math.round(calculatePrice() * 0.1).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-neutral-600">Security deposit</span>
                                        <span className="font-medium">₹{Math.round(calculatePrice() * 0.2).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold border-t border-neutral-200 pt-3">
                                    <span>Total</span>
                                    <span>₹{Math.round(calculatePrice() * 1.3).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowBookingModal(true)}
                                    disabled={!startDate || !endDate}
                                    className="w-full bg-neutral-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Book Now
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!startDate || !endDate}
                                    className="w-full border border-neutral-200 text-neutral-700 py-3 px-4 rounded-lg font-medium hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                            </div>

                            {/* Security Notice */}
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Secure Booking</p>
                                        <p className="text-xs text-green-700">Your payment is protected and secure</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12 bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm">
                    {/* ... (Reviews, forms, filters, and list content remains the same) ... */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900">Reviews & Ratings</h2>
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="bg-neutral-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                        >
                            Write Review
                        </button>
                    </div>

                    {/* Review Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-neutral-900 mb-2">{averageRating}</div>
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-neutral-600">Based on {reviews.length} reviews</p>
                        </div>

                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map(rating => (
                                <div key={rating} className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-neutral-700 w-8">{rating}</span>
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <div className="flex-1 bg-neutral-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full"
                                            style={{
                                                width: `${reviews.length > 0 ? (ratingDistribution[rating] / reviews.length) * 100 : 0}%`
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-neutral-600 w-8">{ratingDistribution[rating]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                        <div className="bg-neutral-50 rounded-xl p-6 mb-8 border border-neutral-200">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Write a Review</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Rating</label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <button
                                            key={rating}
                                            onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                                            className={`p-1 transition-colors ${rating <= newReview.rating ? 'text-yellow-400' : 'text-neutral-300'
                                                }`}
                                        >
                                            <Star className={`w-6 h-6 ${rating <= newReview.rating ? 'fill-current' : ''}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Comment</label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                    className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                                    rows={4}
                                    placeholder="Share your experience with this item..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowReviewForm(false)}
                                    className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={!newReview.comment.trim()}
                                    className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Review Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-neutral-500" />
                            <select
                                value={reviewFilter}
                                onChange={(e) => setReviewFilter(e.target.value)}
                                className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                            >
                                <option value="all">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>

                        <select
                            value={sortReviews}
                            onChange={(e) => setSortReviews(e.target.value)}
                            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="rating-high">Highest Rating</option>
                            <option value="rating-low">Lowest Rating</option>
                            <option value="helpful">Most Helpful</option>
                        </select>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviewsLoading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
                                                <div className="h-3 bg-neutral-200 rounded w-1/6 mb-3"></div>
                                                <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                                                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredAndSortedReviews.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-8 h-8 text-neutral-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No reviews yet</h3>
                                <p className="text-neutral-600">Be the first to review this item!</p>
                            </div>
                        ) : (
                            filteredAndSortedReviews.map((review) => (
                                <div key={review._id} className="border-b border-neutral-200 pb-6 last:border-b-0">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-neutral-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-neutral-900">{review.user?.name || 'Anonymous'}</h4>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-neutral-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-neutral-700 mb-3 leading-relaxed">{review.comment}</p>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleReviewHelpful(review._id, true)}
                                                    className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                                                >
                                                    <ThumbsUp className="w-4 h-4" />
                                                    Helpful ({review.helpfulCount || 0})
                                                </button>
                                                <button
                                                    onClick={() => handleReviewHelpful(review._id, false)}
                                                    className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                                                >
                                                    <ThumbsDown className="w-4 h-4" />
                                                    Not helpful
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Confirmation Modal - Modal JSX remains the same */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                Confirm Booking
                            </h3>
                            <p className="text-neutral-600">
                                Review your booking details before confirming
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="bg-neutral-50 rounded-lg p-4">
                                <h4 className="font-medium text-neutral-900 mb-2">{item.title}</h4>
                                <div className="text-sm text-neutral-600 space-y-1">
                                    <p>Period: {quantity} {selectedPeriod}(s)</p>
                                    <p>Start: {startDate}</p>
                                    <p>End: {endDate}</p>
                                    <p className="font-medium text-neutral-900">Total: ₹{Math.round(calculatePrice() * 1.3).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem('token');
                                        const res = await fetch('/api/cart/add', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${token}`
                                            },
                                            body: JSON.stringify({
                                                item_id: item._id,
                                                quantity: quantity,
                                                rental_type: `per_${selectedPeriod}`,
                                                rental_start_date: startDate,
                                                rental_end_date: endDate
                                            })
                                        });

                                        if (res.ok) {
                                            window.location.href = '/cart';
                                        } else {
                                            alert("Failed to add to cart");
                                        }
                                    } catch (err) {
                                        console.error("Error adding to cart:", err);
                                    }
                                }}
                                className="flex-1 px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetails;