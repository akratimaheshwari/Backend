import React, { useState, useEffect } from 'react';
import { 
  Download, Search, Calendar, CreditCard, 
  CheckCircle, AlertCircle, Clock, ChevronRight, 
  Wallet, ArrowUpRight 
} from 'lucide-react';
import Header from '../components/Header';

const RenterPaymentHistory = () => {
  // --- Header State ---
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const isLoggedIn = !!localStorage.getItem("token");

  // --- Local Page State ---
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('All');

  // --- Mock Data (Renter Perspective) ---
  useEffect(() => {
    setTimeout(() => {
      setTransactions([
        {
          id: 'TXN-8832',
          item: 'Canon EOS R5 Kit',
          period: '12 Oct - 15 Oct',
          amount: 4500,
          status: 'Paid',
          date: '2024-10-12',
          method: 'Visa ending 4242',
          invoiceUrl: '#'
        },
        {
          id: 'TXN-9921',
          item: 'DJI Mavic 3 Cine',
          period: '01 Nov - 05 Nov',
          amount: 12000,
          status: 'Pending', // 💡 Renter needs to pay this
          dueDate: '2024-11-01',
          method: 'Pay on Arrival',
          invoiceUrl: '#'
        },
        {
          id: 'TXN-7721',
          item: 'Camping Tent (4 Person)',
          period: '20 Sep - 22 Sep',
          amount: 1500,
          status: 'Refunded', // 💡 Security deposit returned
          date: '2024-09-23',
          method: 'Wallet',
          invoiceUrl: '#'
        },
        {
          id: 'TXN-6654',
          item: 'GoPro Hero 11',
          period: '10 Aug - 12 Aug',
          amount: 2000,
          status: 'Paid',
          date: '2024-08-10',
          method: 'UPI',
          invoiceUrl: '#'
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  // --- Filter Logic ---
  const filteredTransactions = transactions.filter(txn => 
    filter === 'All' || txn.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200'; // Highlight unpaid
      case 'Refunded': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Overdue': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-600';
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 1. Dashboard Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Payments</h1>
            <p className="text-gray-500 text-sm mt-1">Track your rental expenses and manage invoices.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium shadow-sm">
            <Wallet className="w-4 h-4" />
            Manage Payment Methods
          </button>
        </div>

        {/* 2. Spending Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Spent</p>
              <h3 className="text-xl font-bold text-gray-900">₹20,000</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Payment Due</p>
              <h3 className="text-xl font-bold text-gray-900">₹12,000</h3>
              <p className="text-xs text-amber-600 font-medium">Due by Nov 01</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Refunds Processed</p>
              <h3 className="text-xl font-bold text-gray-900">₹1,500</h3>
            </div>
          </div>
        </div>

        {/* 3. Transaction List Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['All', 'Paid', 'Pending', 'Refunded'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    filter === status 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading transactions...</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium">No transactions found</h3>
                <p className="text-gray-500 text-sm">Try changing your filters.</p>
              </div>
            ) : (
              filteredTransactions.map((txn) => (
                <div key={txn.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {txn.status === 'Paid' ? <CheckCircle className="w-5 h-5 text-green-600" /> : 
                       txn.status === 'Pending' ? <AlertCircle className="w-5 h-5 text-amber-600" /> :
                       <CreditCard className="w-5 h-5 text-gray-600" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{txn.item}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {txn.date || `Due: ${txn.dueDate}`} • {txn.method}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Ref: {txn.id}</p>
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">₹{txn.amount.toLocaleString()}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide mt-1 border ${getStatusColor(txn.status)}`}>
                        {txn.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {txn.status === 'Pending' ? (
                        <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition shadow-sm">
                          Pay Now
                        </button>
                      ) : (
                        <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition" title="Download Receipt">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
          
          {/* Footer / Pagination */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/50 text-xs text-gray-500 flex justify-between items-center">
            <span>Showing recent transactions</span>
            <button className="hover:text-gray-900 font-medium">View All History &rarr;</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RenterPaymentHistory;