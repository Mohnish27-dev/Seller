'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiClock, 
  FiAlertTriangle,
  FiPlus,
  FiArrowRight,
  FiTrendingUp,
  FiPause,
  FiCheckCircle
} from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
      shadowColor: 'shadow-emerald-500/20',
    },
    {
      title: 'Total Orders',
      value: stats?.stats?.totalOrders || 0,
      icon: FiPackage,
      gradient: 'from-blue-500 to-cyan-600',
      shadowColor: 'shadow-blue-500/20',
    },
    {
      title: 'Total Products',
      value: stats?.stats?.totalProducts || 0,
      icon: FiShoppingBag,
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/20',
    },
    {
      title: 'Total Customers',
      value: stats?.stats?.totalUsers || 0,
      icon: FiUsers,
      gradient: 'from-orange-500 to-red-600',
      shadowColor: 'shadow-orange-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <Link 
          href="/admin/products/add"
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
        >
          <FiPlus size={18} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 ${stat.shadowColor} hover:shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg ${stat.shadowColor}`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders Alert */}
        {stats?.stats?.pendingOrders > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-center space-x-4">
            <div className="bg-amber-500/20 p-3 rounded-xl">
              <FiClock className="text-amber-400" size={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-300">
                {stats.stats.pendingOrders} Pending Orders
              </p>
              <p className="text-sm text-amber-200/70">
                Review and process pending orders
              </p>
            </div>
            <Link 
              href="/admin/orders?status=pending"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              <FiArrowRight size={20} />
            </Link>
          </div>
        )}

        {/* Low Stock Alert */}
        <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-2xl p-5 flex items-center space-x-4">
          <div className="bg-red-500/20 p-3 rounded-xl">
            <FiAlertTriangle className="text-red-400" size={24} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-red-300">
              Low Stock Alert
            </p>
            <p className="text-sm text-red-200/70">
              Check products with low inventory
            </p>
          </div>
          <Link 
            href="/admin/products?filter=low-stock"
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <FiArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/admin/products/add"
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center space-x-4 hover:bg-slate-800 hover:border-cyan-500/30 transition-all group"
        >
          <div className="bg-cyan-500/10 p-3 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
            <FiPlus className="text-cyan-400" size={20} />
          </div>
          <div>
            <p className="font-medium text-white">Add New Product</p>
            <p className="text-sm text-slate-400">Create a new product listing</p>
          </div>
        </Link>

        <Link 
          href="/admin/orders"
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center space-x-4 hover:bg-slate-800 hover:border-blue-500/30 transition-all group"
        >
          <div className="bg-blue-500/10 p-3 rounded-xl group-hover:bg-blue-500/20 transition-colors">
            <FiPackage className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="font-medium text-white">View Orders</p>
            <p className="text-sm text-slate-400">Manage customer orders</p>
          </div>
        </Link>

        <Link 
          href="/admin/products"
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center space-x-4 hover:bg-slate-800 hover:border-violet-500/30 transition-all group"
        >
          <div className="bg-violet-500/10 p-3 rounded-xl group-hover:bg-violet-500/20 transition-colors">
            <FiShoppingBag className="text-violet-400" size={20} />
          </div>
          <div>
            <p className="font-medium text-white">All Products</p>
            <p className="text-sm text-slate-400">Manage product inventory</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
          <Link 
            href="/admin/orders" 
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center space-x-1 transition-colors"
          >
            <span>View All</span>
            <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{order.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-white font-medium">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : order.orderStatus === 'pending'
                            ? 'bg-amber-500/20 text-amber-400'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {order.orderStatus === 'delivered' && <FiCheckCircle className="mr-1" size={12} />}
                        {order.orderStatus === 'pending' && <FiClock className="mr-1" size={12} />}
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <FiPackage className="mx-auto mb-3 opacity-50" size={32} />
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
