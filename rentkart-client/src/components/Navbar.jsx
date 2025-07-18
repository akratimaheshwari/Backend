import React from 'react';
import { Plus, Package } from 'lucide-react';

const Navbar = ({ onAddItemClick }) => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Package className="w-8 h-8 text-gray-900 mr-2" />
            <span className="text-2xl font-bold text-gray-900">RentKart</span>
          </div>

          {/* Add Item Button */}
          <button
            onClick={onAddItemClick}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Item
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;