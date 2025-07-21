import React, { useEffect, useState } from 'react';
import { 
  Package, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Filter,
  Search,
  Download,
  TrendingUp,
  DollarSign,
  Eye,
  MessageCircle,
  Star,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeRentals: 0
  });

  const statusConfig = {
    Pending: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    Approved: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
    Delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: Package },
    'Return Requested': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: AlertTriangle },
    Returned: { color: 'bg-neutral-100 text-neutral-800 border-neutral-200', icon: CheckCircle },
    Cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
  };

  useEffect(() => {
    fetchOwnerOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const fetchOwnerOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders/owner', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      calculateStats(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const stats = {
      totalOrders: ordersData.length,
      pendingOrders: ordersData.filter(o => o.status === 'Pending').length,
      totalRevenue: ordersData.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      activeRentals: ordersData.filter(o => o.status === 'Delivered').length
    };
    setStats(stats);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => 
          item.item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
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

      if (res.ok) {
        setOrders(prev =>
          prev.map(o =>
            o._id === orderId ? { ...o, status: 'Approved' } : o
          )
        );
        alert('Order approved successfully!');
      }
    } catch (err) {
      console.error('Error approving order:', err);
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

      if (res.ok) {
        setOrders(prev =>
          prev.map(o =>
            o._id === orderId ? { ...o, status: 'Cancelled' } : o
          )
        );
        alert('Order rejected successfully!');
      }
    } catch (err) {
      console.error('Error rejecting order:', err);
      alert('Failed to reject order. Please try again.');
    }
  };

  const handleContactRenter = (order) => {
    const message = `Hi ${order.user?.name}, regarding your rental request for ${order.items?.[0]?.item?.name}...`;
    window.open(`mailto:${order.user?.email}?subject=Rental Request&body=${encodeURIComponent(message)}`);
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Renter', 'Item', 'Status', 'Amount', 'Date'].join(','),
      ...filteredOrders.map(order => [
        order._id?.slice(-8),
        order.user?.name,
        order.items?.[0]?.item?.name,
        order.status,
        order.totalAmount,
        new Date(order.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `owner-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
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
              <h1 className="text-3xl font-bold text-neutral-900">Rental Requests</h1>
              <p className="text-neutral-600 mt-1">
                Manage incoming rental requests for your items
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
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
                <p className="text-2xl font-bold text-neutral-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Pending Approval</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Revenue</p>
                <p className="text-2xl font-bold text-neutral-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Active Rentals</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.activeRentals}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Delivered">Delivered</option>
                <option value="Return Requested">Return Requested</option>
                <option value="Returned">Returned</option>
                <option value="Cancelled">Cancelled</option>
              </select>

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
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                <Package className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No rental requests found</h3>
              <p className="text-neutral-600 mb-6">
                {statusFilter === 'all' 
                  ? "You don't have any rental requests yet"
                  : `No orders with status "${statusFilter}"`
                }
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.Pending;
              const StatusIcon = status.icon;

              return (
                <div key={order._id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Order Header */}
                  <div className="p-6 border-b border-neutral-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-neutral-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">{order.user?.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-neutral-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span>{order.user?.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{order.user?.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {order.status}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                          <img
                            src={item.item?.images?.[0] || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={item.item?.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-neutral-900">{item.item?.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-neutral-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(item.rentalStart).toLocaleDateString()} - {new Date(item.rentalEnd).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-neutral-900">₹{item.totalPrice?.toLocaleString()}</p>
                            <p className="text-sm text-neutral-600">₹{item.pricePerDay}/day</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Address */}
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Delivery Address</p>
                          <p className="text-sm text-blue-800">{order.shippingAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-600">Order Total:</span>
                        <span className="font-bold text-lg text-neutral-900">₹{order.totalAmount?.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleContactRenter(order)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contact
                        </button>
                        
                        {order.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleReject(order._id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(order._id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Order Details</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Renter Info */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <h4 className="font-semibold text-neutral-900 mb-3">Renter Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600">Name:</span>
                    <span className="ml-2 font-medium text-neutral-900">{selectedOrder.user?.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600">Email:</span>
                    <span className="ml-2 font-medium text-neutral-900">{selectedOrder.user?.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600">Phone:</span>
                    <span className="ml-2 font-medium text-neutral-900">{selectedOrder.user?.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600">Order Date:</span>
                    <span className="ml-2 font-medium text-neutral-900">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-neutral-900 mb-3">Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.item?.images?.[0] || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={item.item?.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-neutral-900">{item.item?.name}</h5>
                          <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-neutral-600">
                            {new Date(item.rentalStart).toLocaleDateString()} - {new Date(item.rentalEnd).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-neutral-900">₹{item.totalPrice?.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-neutral-900">Total Amount</span>
                  <span className="text-xl font-bold text-neutral-900">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerOrders;

