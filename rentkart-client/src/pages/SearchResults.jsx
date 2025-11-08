import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Search, Package, ArrowLeft } from 'lucide-react';
import Header from "../components/Header";

const SearchResults = () => {
    // --- Router & Query State ---
    const routerLocation = useLocation();
    const queryParams = new URLSearchParams(routerLocation.search);
    const initialQuery = queryParams.get("q") || "";
    const initialLocation = queryParams.get("loc") || "";
    
    // --- Local State ---
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    
    // State for Header synchronization
    const [search, setSearch] = useState(initialQuery);
    const [location, setLocation] = useState(initialLocation);
    const isLoggedIn = !!localStorage.getItem("token");

    // --- Effect: Sync local state with URL params if they change ---
    useEffect(() => {
        setSearch(initialQuery);
        setLocation(initialLocation);
    }, [initialQuery, initialLocation]);

    // --- Effect: Fetch Data ---
    useEffect(() => {
        if (!initialQuery) {
            setLoading(false);
            setResults([]);
             // Optional: setNotFound(true) if you want to show empty state for no query
            return;
        }

        setLoading(true);
        setNotFound(false);

        // Construct API URL with optional location parameter
        const locQuery = initialLocation ? `&loc=${encodeURIComponent(initialLocation)}` : '';
        const apiUrl = `/api/items/search?q=${encodeURIComponent(initialQuery)}${locQuery}`;

        fetch(apiUrl)
            .then((res) => {
                if (!res.ok) throw new Error("Search failed");
                return res.json();
            })
            .then((data) => {
                // Ensure data is an array before setting it
                const validResults = Array.isArray(data) ? data : [];
                setResults(validResults);
                setNotFound(validResults.length === 0);
            })
            .catch((err) => {
                console.error("Search API Error:", err);
                setResults([]);
                setNotFound(true);
            })
            .finally(() => setLoading(false));
    }, [initialQuery, initialLocation]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Reusable Header */}
            <Header
                location={location}
                setLocation={setLocation}
                search={search}
                setSearch={setSearch}
                isLoggedIn={isLoggedIn}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Page Title & Back Button */}
                <div className="mb-5">
                    <button 
                      onClick={() => window.history.back()}
                      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Search Results for:{" "}
                        <span className="text-blue-600">"{initialQuery}"</span>
                    </h2>
                    {!loading && !notFound && (
                        <p className="text-gray-600 mt-2">
                            Found {results.length} result{results.length !== 1 ? 's' : ''}.
                        </p>
                    )}
                </div>

                {/* Content Area */}
                {loading ? (
                    // 1. Loading Skeletons
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="flex justify-between">
                                     <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notFound ? (
                    // 2. Not Found State (Centered)
                    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-8">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-1xl font-bold text-gray-900 mb-2">
                            No items found matching "{initialQuery}"
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            We couldn't find what you were looking for. Try adjusting your search terms or check back later.
                        </p>
                        <Link 
                            to="/items" 
                            className="bg-neutral-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                        >
                            Browse All Items
                        </Link>
                    </div>
                ) : (
                    // 3. Results Grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
                        {results.map((item) => (
                            <Link 
                                key={item._id}
                                to={`/items/${item._id}`}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={item.imageUrl || item.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
                                        alt={item.title || item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Optional: Availability Badge if data exists */}
                                    <div className="absolute top-3 left-3">
                                         <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                            <Package className="w-3 h-3" /> Available
                                         </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
                                            {item.title || item.name}
                                        </h3>
                                        {item.location && (
                                            <p className="text-sm text-gray-500 mb-3">{item.location}</p>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div>
                                            <span className="text-xl font-extrabold text-gray-900">
                                                ₹{(item.pricing?.per_day || item.price || 0).toLocaleString()}
                                            </span>
                                            <span className="text-sm text-gray-500 font-medium ml-1">/day</span>
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

export default SearchResults;