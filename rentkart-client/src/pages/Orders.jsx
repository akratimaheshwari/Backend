import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import OrderCard from "../components/OrderCard";
import { FaFilter, FaSortAmountDown, FaShareAlt } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/orders/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load orders");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Something went wrong.");
      }
    };

    fetchOrders();
  }, []);

  const handleReturn = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/orders/return/${orderId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Return failed");

      toast.success("Return requested successfully");
    } catch (err) {
      console.error("Return error:", err);
      toast.error("Failed to request return");
    }
  };

  const handleShare = (order) => {
    const shareText = `Hey! I just rented ${order.item.name} from this amazing app. Check it out!`;
    if (navigator.share) {
      navigator
        .share({
          title: "Check out what I rented!",
          text: shareText,
          url: window.location.href,
        })
        .catch((err) => toast.error("Sharing cancelled or failed."));
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      toast.success("Copied link to clipboard!");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = order.item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto mt-6 p-4 bg-white rounded-2xl shadow-2xl animate-fade-in">
      <Toaster />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">My Orders 📦</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-full bg-gray-100 border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-full bg-gray-100 border text-sm shadow-sm hover:shadow focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-full bg-gray-100 border text-sm shadow-sm hover:shadow focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="returned">Returned</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {currentOrders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-16">
          💤 No orders yet. Time to explore and rent something cool!
        </div>
      ) : (
        currentOrders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <OrderCard
              order={order}
              onReturn={handleReturn}
              showRating
              showTracking
              showReviewUpload
              showCancel
              showReorder
              showDeliveryProgress
              showChatWithSeller
              showEstimatedDelivery
            />
            <button
              onClick={() => handleShare(order)}
              className="absolute top-4 right-4 p-2 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 transition"
              title="Share this order"
            >
              <FaShareAlt />
            </button>
          </motion.div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold shadow-md transition-colors duration-300 ${
                currentPage === index + 1
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white text-pink-500 border-pink-300 hover:bg-pink-50"
              }`}
            >
              {index + 1}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
