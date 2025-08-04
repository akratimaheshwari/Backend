import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, MapPin, ShoppingCart, ClipboardList, UserCircle, Menu, X } from 'lucide-react';

const Header = ({ location, setLocation }) => {
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
              <a href="/" className="block text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors">Home</a>
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

export default Header;
