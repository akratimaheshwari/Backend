import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Share2,
  Search,
  MessageCircle,
  Package,
  Star,
  Plus,
  DollarSign,
  UserCircle,
  ShoppingCart,
  ClipboardList,
  Menu,
  X,
  Heart,
  MapPin,
  Clock,
  Shield,
  Truck,
  Award,
  Users,
  TrendingUp,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const Header = ({ location, setLocation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");


  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">RentKart</h1>
          </div>

          {/* Search Bar and Location */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8 space-x-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for items, categories..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 rounded-xl"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-lg">
                <Search className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="pl-2 pr-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 w-40"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-800 font-medium">Home</Link>
            <Link to="/items" className="text-gray-600 hover:text-gray-800 font-medium">Browse Items</Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-gray-800">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </Link>
            <Link to="/orders" className="text-gray-600 hover:text-gray-800"><ClipboardList className="w-5 h-5" /></Link>
            {isLoggedIn ? (
              <Link to="/dashboard" className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <UserCircle className="w-4 h-4" /><span>Dashboard</span>
              </Link>
            ) : (
              <Link to="/signup" className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium">Join Now</Link>
            )}
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Location */}
        <div className="md:hidden mt-2 flex items-center gap-2 px-2 pb-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-xs"
          />
        </div>

        {/* Mobile Search Input */}
        {isSearchOpen && (
          <div className="md:hidden mt-2 px-1 pb-2">
            <input
              type="text"
              placeholder="Search for items, categories..."
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 rounded-xl"
            />
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="space-y-3">
              <a href="/home" className="block text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors">Home</a>
              <a href="/items" className="block text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors">Browse Items</a>
              <a href="/cart" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 py-2 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">0</span>
              </a>
              <a href="/orders" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 py-2 transition-colors">
                <ClipboardList className="w-5 h-5" />
                <span>Orders</span>
              </a>
              {isLoggedIn ? (
                <a href="/dashboard" className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                  <UserCircle className="w-5 h-5" />
                  <span>Dashboard</span>
                </a>
              ) : (
                <a href="/signup" className="block bg-gray-800 text-white px-4 py-3 rounded-lg font-medium text-center transition-colors">
                  Join Now
                </a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};



export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Rent What You Need, When You Need It!",
      desc: "Explore a wide range of items at unbeatable prices. Fast delivery and hassle-free returns.",
      btnText: "Start Browsing",
      image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/items",
      gradient: "from-gray-800 to-gray-900"
    },
    {
      title: "Furnish Your Home for Less",
      desc: "Affordable furniture on rent – beds, sofas, tables, and more! Perfect for students and professionals.",
      btnText: "Explore Furniture",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/items",
      gradient: "from-gray-700 to-gray-800"
    },
    {
      title: "Smart Appliances on Rent",
      desc: "Get ACs, refrigerators, washing machines and more – delivered to your door with installation.",
      btnText: "View Appliances",
      image: "https://images.pexels.com/photos/4857781/pexels-photo-4857781.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/items",
      gradient: "from-gray-600 to-gray-700"
    },
    {
      title: "Professional Equipment Rental",
      desc: "Cameras, laptops, tools, and more for your projects. Quality equipment at affordable rates.",
      btnText: "Rent Equipment",
      image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/items",
      gradient: "from-gray-500 to-gray-600"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      <div className="relative h-[500px] md:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${currentSlide === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
              }`}
          >
            <div className={`bg-gradient-to-r ${slide.gradient} h-full`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex flex-col md:flex-row items-center justify-between h-full py-12">
                  <div className="w-full md:w-1/2 space-y-6 text-white z-10">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                      {slide.desc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={slide.link}
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                      >
                        {slide.btnText}
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </a>
                      <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-800 transition-all">
                        Learn More
                      </button>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 mt-8 md:mt-0">
                    <img
                      src={slide.image}
                      alt="Slide"
                      className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <ChevronRight className="w-6 h-6 rotate-180" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

const MAX_FEATURED_ITEMS = 4;

export const FeaturedItems = ({ items, location }) => {
    
    // --- Data Filtering and Limiting ---
    const filteredItems = location
        ? items.filter(item =>
            item.location?.toLowerCase().includes(location.toLowerCase())
        )
        : items;
    
    // Applies the feature limit
    const limitedItems = filteredItems.slice(0, MAX_FEATURED_ITEMS); 

    const navigate = useNavigate();
    // 💡 REMOVED: useState and useEffect for wishlistItems
    // 💡 REMOVED: handleAddToWishlist function

    // --- Unchanged Cart/Checkout Handler (Kept for context) ---
    const handleAddToCartAndCheckout = async (itemId) => {
        try {
            const currentToken = localStorage.getItem("token");
            const res = await axios.post('/api/cart/add', { itemId, quantity: 1 }, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            console.log("Item added to cart", res.data); 
            navigate('/cart');
        } catch (err) {
            console.error("Failed to add item to cart", err); 
        }
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* --- Section Header --- */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Featured Rentals
                    </h2>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                        Discover our curated collection of **{MAX_FEATURED_ITEMS} most popular rental items**{location ? ` in ${location}` : ''}.
                    </p>
                </div>
                {/* --- End Section Header --- */}

                {/* --- Items Grid --- */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
                    {limitedItems.map(item => ( 
                        <div 
                            key={item._id} 
                            className="group bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                        >
                            
                            {/* --- Image Section --- */}
                            <div className="relative overflow-hidden rounded-t-xl"> 
                                <Link to={`/items/${item._id}`}>
                                    <img
                                        src={item.images[0]}
                                        alt={item.title}
                                        className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                    />
                                </Link>

                                {/* Wishlist & Share Buttons Container */}
                                {/* 💡 REMOVED: The Heart Button/Icon and all related logic */}
                                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button 
                                        title="Share Item"
                                        className="p-2 rounded-full bg-white text-neutral-600 hover:bg-gray-100 transition-all shadow-md"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            {/* --- End Image Section --- */}

                            {/* --- Details Section --- */}
                            <div className="p-5 flex flex-col"> 
                                <div className="flex-grow"> 
                                    <Link to={`/items/${item._id}`}>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[56px]"> 
                                            {item.title}
                                        </h4>
                                    </Link>

                                    <div className="flex items-center justify-between text-sm mb-3">
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            <span className="font-semibold text-gray-800">4.8</span>
                                            <span className="text-gray-500">(24 Reviews)</span>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                            <MapPin className="w-4 h-4 mr-1.5" />
                                            <span className="font-medium">{item.location || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div> 

                                {/* Price and Action Buttons Container */}
                                <div>
                                    <div className="flex items-end justify-between border-t pt-4 mt-4">
                                        <div className="text-3xl font-extrabold text-emerald-600">
                                            ₹{item.pricing.per_day}
                                            <span className="text-base font-normal text-gray-500 ml-1">/day</span>
                                        </div>
                                        <div className="text-sm text-gray-500 font-medium">
                                            ₹{item.pricing.per_week || item.pricing.per_day * 7}/week
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-3 mt-5">
                                        <button
                                            onClick={() => navigate(`/items/${item._id}`)}
                                            className="flex-1 bg-gray-800 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors shadow-md"
                                        >
                                            Rent Now
                                        </button>
                                    </div>
                                </div>

                            </div>
                            {/* --- End Details Section --- */}

                        </div>
                    ))}
                </div>
                {/* --- End Items Grid --- */}

                {/* --- No Items Found --- */}
                {limitedItems.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-xl mt-10">
                        <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-xl font-medium">
                            No featured items available {location && `for "${location}"`} at the moment.
                        </p>
                        <p className="text-gray-500 mt-2">Check back soon or try a different location.</p>
                    </div>
                )}
                {/* --- End No Items Found --- */}

            </div>
        </section>
    );
};

export const CategorySection = ({ categories }) => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-2xl font-bold text-gray-900 mb-4">
          Browse by Category
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find exactly what you need from our diverse range of rental categories
        </p>
      </div>

      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map(category =>
          category.slug ? (
            <Link
              to={`/category/${category.slug}`}
              key={category._id}
              className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
            >
              <div className="relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <h3 className="text-center font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-center text-sm text-gray-500 mt-1">
                  {category.itemCount || 0} items
                </p>
              </div>
            </Link>
          ) : null
        )}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Categories will be loaded soon</p>
        </div>
      )}
    </div>
  </section>
);

export const HowItWorks = () => {
  const renterSteps = [
    {
      icon: Search,
      title: 'Search & Browse',
      description: 'Find the perfect item for your needs from thousands of listings across multiple categories',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'Connect & Book',
      description: 'Message the owner, check availability, and book your rental dates with instant confirmation',
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      icon: Package,
      title: 'Pick Up & Enjoy',
      description: 'Collect your item safely or get it delivered, then enjoy using it for your project',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      icon: Star,
      title: 'Return & Review',
      description: 'Return the item in good condition and leave a review to help the community',
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
    }
  ];

  const ownerSteps = [
    {
      icon: Plus,
      title: 'List Your Item',
      description: 'Create a detailed listing with high-quality photos and set your rental prices',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      icon: MessageCircle,
      title: 'Get Requests',
      description: 'Receive rental requests from verified renters and manage your bookings easily',
      color: 'bg-gradient-to-br from-pink-500 to-pink-600'
    },
    {
      icon: DollarSign,
      title: 'Earn Money',
      description: 'Hand over your item securely and start earning passive income from your assets',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
    },
    {
      icon: Star,
      title: 'Build Reputation',
      description: 'Get positive reviews, build trust, and grow your rental business over time',
      color: 'bg-gradient-to-br from-red-500 to-red-600'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All payments are protected with our secure payment system'
    },
    {
      icon: Truck,
      title: 'Flexible Delivery',
      description: 'Choose pickup or delivery options that work for you'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'All items are verified and quality-checked before listing'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of verified renters and owners'
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
            How RentKart Works
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Whether you're looking to rent items or earn money from unused belongings,
            we make the process simple, secure, and rewarding.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center group px-2"
            >
              <div className="bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-gray-200">
                <benefit.icon className="w-5 h-5 text-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-xs mb-1">{benefit.title}</h4>
              <p className="text-[11px] text-gray-500 leading-snug">{benefit.description}</p>
            </div>
          ))}
        </div>



        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Renter Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-center mb-6">
              <div className="bg-gray-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">For Renters</h3>
              <p className="text-sm text-gray-600">Access what you need, when you need it</p>
            </div>
            <div className="space-y-5">
              {renterSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Owner Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-center mb-6">
              <div className="bg-gray-800 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">For Item Owners</h3>
              <p className="text-sm text-gray-600">Earn from unused items easily</p>
            </div>
            <div className="space-y-5">
              {ownerSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <div className="bg-gray-800 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-semibold mb-3">Ready to Get Started?</h3>
            <p className="text-sm mb-4 opacity-90">Join thousands already renting and earning on RentKart</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-gray-800 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                Start Renting
              </button>
              <button className="border border-white text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-gray-800">
                List Your Items
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">RentKart</h3>
          </div>
          <p className="text-gray-400 mb-6 max-w-md">
            Why buy when you can rent? Discover, lend, and earn with RentKart — your smart rental marketplace.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/items" className="text-gray-400 hover:text-white transition-colors">Browse Items</a></li>
            <li><a href="/about-us" className="text-gray-400 hover:text-white transition-colors">About us</a></li>
            <li><a href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
            <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            
          </ul>
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-t border-gray-800 mt-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span>support@rentkart.com</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 RentKart. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
);
