// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              RentKart
            </h1>
          </div>
          <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">
            Home
          </Link>
        </div>
      </header>

      {/* 404 Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 transition"
        >
          <ArrowLeft size={18} />
          404 404
        </button>
      </main>
    </div>
  );
};

export default NotFound;

