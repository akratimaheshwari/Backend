import React, { useEffect, useState } from 'react';
import { Search, Filter, Grid, List, SlidersHorizontal, MapPin, Star } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import Header from '../components/Header';

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState(location);
  const isLoggedIn = !!localStorage.getItem('token');

  // Debounce location input by 1000ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(location);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location]);

  // Fetch items when debounced location changes
  const fetchItems = async () => {
    try {
      setLoading(true);
      let url = '/api/items';

      const params = new URLSearchParams();
      if (debouncedLocation) params.append('location', debouncedLocation);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [debouncedLocation]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        console.log("Fetched categories:", data);
        if (Array.isArray(data)) setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleLike = async (id) => {
    try {
      await fetch(`/api/items/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchItems(); // Refresh items after liking
    } catch (err) {
      console.error("Failed to like item:", err);
    }
  };


  const handleAddToCart = async (item) => {
    try {

      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          itemId: item._id,
          quantity: 1
        })
      });

      if (res.ok) {
        alert('Item added to cart successfully!');
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === 'all' || item.category?._id === filterCategory;

      const price = item.pricing?.per_day || item.price || 0;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.pricing?.per_day || a.price) - (b.pricing?.per_day || b.price);
        case 'price-high':
          return (b.pricing?.per_day || b.price) - (a.pricing?.per_day || a.price);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popular':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header location={location} setLocation={setLocation} isLoggedIn={isLoggedIn} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4">
                  <div className="h-56 bg-neutral-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <Header location={location} setLocation={setLocation} isLoggedIn={isLoggedIn} />

      {/* Main content container - reduced top padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">

        {/* Search Bar */}


        {/* Mobile Filters Toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-2xl font-bold text-neutral-900">
            {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'Item' : 'Items'}
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-72 flex-shrink-0">
            <div
              className={`bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto ${showFilters ? 'block' : 'hidden lg:block'
                }`}
            >


              <div className="hidden lg:block mb-6">
                <h2 className="text-xl font-bold text-neutral-900">
                  {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'Item' : 'Items'}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-4">Category</h4>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-4">Price Range (per day)</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-neutral-600 mb-1">Min Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 text-sm">₹</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            className="w-full pl-8 pr-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex-shrink-0 pt-6">
                        <span className="text-neutral-400 font-medium">-</span>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-neutral-600 mb-1">Max Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 text-sm">₹</span>
                          <input
                            type="number"
                            placeholder="2000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000])}
                            className="w-full pl-8 pr-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-600">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </div>

                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-4">Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <button
                        key={rating}
                        className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors group"
                      >
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`}

                            />
                          ))}
                        </div>
                        <span className="text-sm text-neutral-600 group-hover:text-neutral-900">& up</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearch('');
                    setFilterCategory('all');
                    setPriceRange([0, 10000]);
                  }}
                  className="w-full px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Controls Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Items Grid/List */}
            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
                <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No items found</h3>
                <p className="text-neutral-600 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setFilterCategory('all');
                    setPriceRange([0, 10000]);
                  }}
                  className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1'
                }`}>
                {filteredAndSortedItems.map(item => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    handleLike={handleLike}
                    onAddToCart={handleAddToCart}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
