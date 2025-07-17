import React, { useEffect, useState } from "react";
import { ArrowRight, Star, Trash2, ImagePlus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  "Return Requested": "bg-purple-100 text-purple-700",
  Cancelled: "bg-red-100 text-red-700",
};

const ITEMS_PER_PAGE = 4;

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [reviews, setReviews] = useState({});
  const [reviewImages, setReviewImages] = useState({});
  const [sortKey, setSortKey] = useState("date");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOwnerOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("api/orders/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Owner orders error:", errorText);
          toast.error("Failed to load owner orders.");
          return;
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Something went wrong.");
      }
    };

    fetchOwnerOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];
    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    if (sortKey === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, sortKey, statusFilter]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Cancellation failed");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel order");
    }
  };

  const handleRating = async (orderId, ratingValue, reviewText, image) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("rating", ratingValue);
      formData.append("review", reviewText);
      if (image) formData.append("image", image);

      const res = await fetch(`/api/orders/${orderId}/rate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Rating failed");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, rating: ratingValue, review: reviewText } : order
        )
      );
      toast.success("🎉 Thank you for rating and sharing your feedback!");
    } catch (error) {
      console.error("Rating error:", error);
      toast.error("Failed to submit rating");
    }
  };

  const indexOfLastOrder = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstOrder = indexOfLastOrder - ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-pink-100 via-white to-blue-100 min-h-screen py-10 animate-fade-in">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2 font-sans">
          📦 My Listings - Rent History
        </h2>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3">
            <select
              className="border rounded p-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              {Object.keys(statusColors).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              className="border rounded p-2 text-sm"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No rentals found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6">
              {currentOrders.map((order, index) => {
                const statusStyle = statusColors[order.status] || "bg-gray-100 text-gray-700";
                const reviewText = reviews[order._id] || "";
                return (
                  <div
                    key={order._id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-5 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* existing order details */}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-white border hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronLeft />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const isActive = currentPage === index + 1;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`relative group px-4 py-2 rounded-full border transition duration-300 font-semibold tracking-wide shadow-sm hover:shadow-md focus:outline-none
                      ${isActive ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent" : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"}`}
                  >
                    {index + 1}
                    {isActive && (
                      <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-indigo-500 animate-bounce">
                        🔥
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-white border hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerOrders;
