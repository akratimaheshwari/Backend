import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Filter, 
  Search, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import OrderCard from '../components/OrderCard';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('renter'); // 'renter' or 'owner'
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    delivered: 0,
    returned: 0,
    totalRevenue: 0
  });

  const statusTabs = [
    { id: 'all', label: 'All Orders', icon: Package },
    { id: 'Pending', label: 'Pending', icon: Clock },
    { id: 'Approved', label: 'Approved', icon: CheckCircle },
    { id: 'Delivered', label: 'Delivered', icon: Package },
    { id: 'Return Requested', label: 'Returns', icon: RotateCcw },
    { id: 'Cancelled', label: 'Cancelled', icon: XCircle }
  ];

  useEffect(() => {
    // Determine user role from localStorage or API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || 'renter');
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, activeTab, searchTerm, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = userRole === 'owner' ? '/api/orders/owner' : '/api/orders';
      
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      calculateStats(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const stats = {
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === 'Pending').length,
      approved: ordersData.filter(o => o.status === 'Approved').length,
      delivered: ordersData.filter(o => o.status === 'Delivered').length,
      returned: ordersData.filter(o => o.status === 'Returned').length,
      totalRevenue: ordersData.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    };
    setStats(stats);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(order => order.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= filterDate
      );
    }

    setFilteredOrders(filtered);
  };

  const handleReturn = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        throw new Error('Return request failed');
      }

      setOrders(prev =>
        prev.map(o =>
          o._id === orderId ? { ...o, status: 'Return Requested' } : o
        )
      );
    } catch (err) {
      console.error('Return error:', err);
      alert('Failed to request return. Please try again.');
    }
  };

  const handleApprove = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to approve order');
      }

      setOrders(prev =>
        prev.map(o =>
          o._id === orderId ? { ...o, status: 'Approved' } : o
        )
      );
    } catch (err) {
      console.error('Approve error:', err);
      alert('Failed to approve order. Please try again.');
    }
  };

  const handleReject = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to reject order');
      }

      setOrders(prev =>
        prev.map(o =>
          o._id === orderId ? { ...o, status: 'Cancelled' } : o
        )
      );
    } catch (err) {
      console.error('Reject error:', err);
      alert('Failed to reject order. Please try again.');
    }
  };

  const handleContact = (order) => {
    const contactInfo = userRole === 'renter' ? order.owner : order.renter;
    const message = `Hi, I'm contacting you regarding order #${order._id?.slice(-8)} for ${order.item?.name || order.item?.title}.`;
    window.open(`mailto:${contactInfo?.email}?subject=Order Inquiry&body=${encodeURIComponent(message)}`);
  };

  const handleRate = async (orderId, rating, review) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, review }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit rating');
      }

      setOrders(prev =>
        prev.map(o =>
          o._id === orderId ? { ...o, rated: true, rating, review } : o
        )
      );
    } catch (err) {
      console.error('Rating error:', err);
      alert('Failed to submit rating. Please try again.');
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Item', 'Status', 'Amount', 'Date', 'Duration'].join(','),
      ...filteredOrders.map(order => [
        order._id?.slice(-8),
        order.item?.name || order.item?.title,
        order.status,
        order.totalAmount,
        new Date(order.createdAt).toLocaleDateString(),
        order.duration
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-neutral-200 rounded-xl"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-neutral-200 rounded-2xl"></div>
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
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                {userRole === 'owner' ? 'Rental Requests' : 'My Orders'}
              </h1>
              <p className="text-neutral-600 mt-1">
                {userRole === 'owner' 
                  ? 'Manage incoming rental requests and track your items'
                  : 'Track your rental orders and manage returns'
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={exportOrders}
                className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Orders</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Pending</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Delivered</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.delivered}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  {userRole === 'owner' ? 'Revenue' : 'Total Spent'}
                </p>
                <p className="text-2xl font-bold text-neutral-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {statusTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                <Package className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No orders found</h3>
              <p className="text-neutral-600 mb-6">
                {activeTab === 'all' 
                  ? "You don't have any orders yet"
                  : `No orders with status "${activeTab}"`
                }
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onReturn={handleReturn}
                onApprove={handleApprove}
                onReject={handleReject}
                onContact={handleContact}
                onRate={handleRate}
                userRole={userRole}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
