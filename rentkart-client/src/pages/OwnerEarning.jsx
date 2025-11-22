import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, Clock, Wallet, 
  Download, Calendar, ChevronDown, ArrowUpRight, 
  Filter, Search 
} from 'lucide-react';
import Header from '../components/Header';

const OwnerEarnings = () => {
  // --- Header States ---
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const isLoggedIn = !!localStorage.getItem("token");

  // --- Page States ---
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('This Month');
  const [transactions, setTransactions] = useState([]);
  
  // --- Mock Data ---
  const earningStats = {
    netIncome: 45250,
    availableBalance: 12500,
    pendingClearance: 3400,
    totalWithdrawals: 32000,
    growth: "+12.5%"
  };

  // Mock Chart Data (Simple representation)
  const monthlyData = [
    { month: 'May', amount: 12000, height: 'h-32' },
    { month: 'Jun', amount: 15000, height: 'h-40' },
    { month: 'Jul', amount: 18000, height: 'h-48' },
    { month: 'Aug', amount: 14000, height: 'h-36' },
    { month: 'Sep', amount: 22000, height: 'h-56' },
    { month: 'Oct', amount: 45250, height: 'h-64' }, // Current
  ];

  useEffect(() => {
    // Simulate Fetching Data
    setTimeout(() => {
      setTransactions([
        {
          id: 'EARN-001',
          item: 'Sony Alpha A7 III',
          renter: 'Rahul Sharma',
          date: '2024-10-24',
          amount: 4500,
          status: 'Cleared',
          payoutDate: '2024-10-25'
        },
        {
          id: 'EARN-002',
          item: 'DJI Mavic 3 Pro',
          renter: 'Priya Singh',
          date: '2024-10-22',
          amount: 12000,
          status: 'Processing', // Available soon
          payoutDate: '2024-10-28'
        },
        {
          id: 'EARN-003',
          item: 'GoPro Hero 11',
          renter: 'Amit Kumar',
          date: '2024-10-20',
          amount: 2100,
          status: 'Cleared',
          payoutDate: '2024-10-21'
        },
        {
          id: 'EARN-004',
          item: 'Camping Tent (4P)',
          renter: 'Sneha Gupta',
          date: '2024-10-18',
          amount: 800,
          status: 'Withdrawn', // Already paid out
          payoutDate: '2024-10-19'
        },
        {
          id: 'EARN-005',
          item: 'Projector 4K',
          renter: 'Vikram Malhotra',
          date: '2024-10-15',
          amount: 3400,
          status: 'Pending', // Rental still active
          payoutDate: '-'
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Cleared': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Withdrawn': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        location={location} 
        setLocation={setLocation} 
        search={search} 
        setSearch={setSearch} 
        isLoggedIn={isLoggedIn}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Earnings Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Overview of your rental income and payouts.</p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition shadow-lg shadow-neutral-200">
              <Wallet className="w-4 h-4" />
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* 2. Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Net Income */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 rounded-lg text-green-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {earningStats.growth}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">Net Income (YTD)</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{earningStats.netIncome.toLocaleString()}</h3>
          </div>

          {/* Available Balance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">Available Balance</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{earningStats.availableBalance.toLocaleString()}</h3>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mb-8 opacity-50"></div>
          </div>

          {/* Pending Clearance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">Pending Clearance</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{earningStats.pendingClearance.toLocaleString()}</h3>
          </div>

          {/* Total Withdrawn */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">Total Withdrawn</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{earningStats.totalWithdrawals.toLocaleString()}</h3>
          </div>
        </div>

        {/* 3. Analytics Graph & Recent Transactions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Analytics Chart (Mockup) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
              <div className="relative">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option>This Month</option>
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Simple CSS Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                  <div className="relative w-full flex justify-center">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      ₹{data.amount.toLocaleString()}
                    </div>
                    {/* Bar */}
                    <div 
                      className={`w-full max-w-[40px] ${data.height} bg-neutral-100 rounded-t-lg group-hover:bg-neutral-900 transition-all duration-300`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Stats / Upcoming Payouts */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-6 rounded-xl shadow-lg text-white">
              <h3 className="text-lg font-bold mb-1">Next Payout</h3>
              <p className="text-neutral-400 text-sm mb-4">Scheduled for tomorrow</p>
              <div className="flex items-baseline gap-1">
                 <span className="text-3xl font-bold">₹3,400</span>
                 <span className="text-sm text-neutral-400">.00</span>
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-700 flex justify-between text-sm">
                <span className="text-neutral-400">Bank Account</span>
                <span className="font-medium">HDFC **** 8821</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Detailed Transaction Table */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Renter</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))
                ) : (
                  transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{txn.item}</div>
                        <div className="text-xs text-gray-500">{txn.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {txn.renter}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(txn.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(txn.status)}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-gray-900">+ ₹{txn.amount.toLocaleString()}</div>
                        {txn.status !== 'Pending' && (
                           <div className="text-xs text-green-600 flex justify-end items-center gap-1 mt-1">
                             Processed <ArrowUpRight className="w-3 h-3" />
                           </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
            <button className="text-sm text-gray-600 font-medium hover:text-gray-900">View All Transactions</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerEarnings;