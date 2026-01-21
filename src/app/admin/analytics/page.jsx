'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers,
  FiCalendar,
  FiBarChart2
} from 'react-icons/fi';

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-800 rounded-lg w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: FiDollarSign,
      gradient: 'from-emerald-500 to-teal-600',
      change: '+12.5%',
      changePositive: true,
    },
    {
      title: 'Total Orders',
      value: stats?.stats?.totalOrders || 0,
      icon: FiShoppingBag,
      gradient: 'from-blue-500 to-cyan-600',
      change: '+8.2%',
      changePositive: true,
    },
    {
      title: 'Total Products',
      value: stats?.stats?.totalProducts || 0,
      icon: FiBarChart2,
      gradient: 'from-violet-500 to-purple-600',
      change: '+3',
      changePositive: true,
    },
    {
      title: 'Total Customers',
      value: stats?.stats?.totalUsers || 0,
      icon: FiUsers,
      gradient: 'from-orange-500 to-red-600',
      change: '+5.4%',
      changePositive: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Track your store&apos;s performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.changePositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Sales Chart Placeholder */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Monthly Sales</h2>
            <p className="text-slate-400 text-sm">Revenue over the last 6 months</p>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <FiCalendar size={18} />
            <span>Last 6 months</span>
          </div>
        </div>
        
        {/* Simple Bar Chart Visualization */}
        <div className="flex items-end justify-between h-64 px-4">
          {(stats?.monthlySales || []).length > 0 ? (
            stats.monthlySales.map((month, index) => {
              const maxValue = Math.max(...stats.monthlySales.map(m => m.total));
              const height = (month.total / maxValue) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1 px-2">
                  <div 
                    className="w-full max-w-16 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg transition-all hover:from-cyan-400 hover:to-blue-400"
                    style={{ height: `${height}%`, minHeight: '20px' }}
                  >
                  </div>
                  <p className="text-slate-400 text-xs mt-2">
                    {new Date(2024, month._id.month - 1).toLocaleString('default', { month: 'short' })}
                  </p>
                  <p className="text-slate-500 text-xs">₹{(month.total / 1000).toFixed(0)}K</p>
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <FiTrendingUp className="mx-auto text-slate-600 mb-4" size={48} />
                <p className="text-slate-400">No sales data available yet</p>
                <p className="text-slate-500 text-sm">Data will appear once you have orders</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Products Placeholder */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Performance Overview</h2>
        <div className="text-center py-12 text-slate-400">
          <FiBarChart2 className="mx-auto mb-4 opacity-50" size={48} />
          <p>Advanced analytics features coming soon</p>
          <p className="text-sm text-slate-500 mt-1">Track product performance, customer behavior, and more</p>
        </div>
      </div>
    </div>
  );
}
