import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp,
  UserCheck
} from 'lucide-react';

const Dashboard = () => {
  const { userData } = useContext(AppContext);

  // Dummy stats for the UI
  const stats = [
    { label: 'Active Loans', value: '$12,400', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Approval', value: '2', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Credit Score', value: '742', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Verification', value: 'Verified', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome back, {userData?.name || 'User'}! 👋
          </h1>
          <p className="text-slate-500 font-medium">Here's what's happening with your loans today.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-100">
          Apply for New Loan <ArrowUpRight size={20} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Recent Applications</h3>
              <span className="text-purple-600 text-sm font-bold cursor-pointer hover:underline">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase">Loan Type</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase">Amount</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { type: 'Personal Loan', amount: '$5,000', status: 'Approved', date: 'Apr 02, 2026', color: 'text-emerald-600' },
                    { type: 'Business Expansion', amount: '$25,000', status: 'In Review', date: 'Mar 28, 2026', color: 'text-amber-600' },
                    { type: 'Vehicle Finance', amount: '$12,000', status: 'Approved', date: 'Mar 15, 2026', color: 'text-emerald-600' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 font-bold text-slate-700">{row.type}</td>
                      <td className="p-4 font-medium text-slate-600">{row.amount}</td>
                      <td className={`p-4 font-bold text-sm ${row.color}`}>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={14} /> {row.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-sm font-medium">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Tips */}
          <div className="space-y-6">
            <div className="bg-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-100 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Boost your Score</h3>
                <p className="text-purple-100 text-sm mb-4">Complete your professional profile to unlock better interest rates.</p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors">
                  Complete Profile
                </button>
              </div>
              <LayoutDashboard className="absolute -right-4 -bottom-4 text-purple-500 opacity-20 rotate-12 group-hover:scale-110 transition-transform" size={120} />
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Support</h3>
              <p className="text-slate-500 text-sm mb-4">Need help with your application? Our experts are available 24/7.</p>
              <button className="w-full py-3 border-2 border-slate-100 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;