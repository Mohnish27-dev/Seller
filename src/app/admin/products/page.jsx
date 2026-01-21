'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiPause,
  FiPlay,
  FiMoreVertical,
  FiAlertCircle,
  FiPackage,
  FiEye
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const categories = ['all', 'salwar', 'suit', 'maxi', 'gown', 'legging', 'kurti', 'dupatta', 'other'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Use admin API to get ALL products including paused ones
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      // Use admin API for delete
      const res = await fetch(`/api/admin/products/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleToggleStatus = async (slug, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/products/${slug}/toggle-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      if (res.ok) {
        toast.success(currentStatus ? 'Product paused' : 'Product activated');
        fetchProducts();
      } else {
        toast.error('Failed to update product status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const getStockStatus = (totalStock) => {
    if (totalStock === 0) return { label: 'Out of Stock', color: 'bg-red-500/20 text-red-400' };
    if (totalStock < 10) return { label: 'Low Stock', color: 'bg-amber-500/20 text-amber-400' };
    return { label: 'In Stock', color: 'bg-emerald-500/20 text-emerald-400' };
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && p.isActive) || 
      (statusFilter === 'paused' && !p.isActive);
    
    let matchesStock = true;
    if (stockFilter === 'out') matchesStock = p.totalStock === 0;
    else if (stockFilter === 'low') matchesStock = p.totalStock > 0 && p.totalStock < 10;
    else if (stockFilter === 'in') matchesStock = p.totalStock >= 10;

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  const activeCount = products.filter(p => p.isActive).length;
  const pausedCount = products.filter(p => !p.isActive).length;
  const lowStockCount = products.filter(p => p.totalStock < 10 && p.totalStock > 0).length;
  const outOfStockCount = products.filter(p => p.totalStock === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-slate-400 mt-1">Manage your product inventory</p>
        </div>
        <Link 
          href="/admin/products/add" 
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
        >
          <FiPlus size={18} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-white mt-1">{products.length}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Paused</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{pausedCount}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Low/Out of Stock</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{lowStockCount + outOfStockCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-slate-800">
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer"
          >
            <option value="all" className="bg-slate-800">All Status</option>
            <option value="active" className="bg-slate-800">Active</option>
            <option value="paused" className="bg-slate-800">Paused</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer"
          >
            <option value="all" className="bg-slate-800">All Stock</option>
            <option value="in" className="bg-slate-800">In Stock</option>
            <option value="low" className="bg-slate-800">Low Stock</option>
            <option value="out" className="bg-slate-800">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-16 bg-slate-700/50 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.totalStock);
                  return (
                    <tr key={product._id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                            <Image
                              src={product.images?.[0]?.url || '/placeholder.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="text-sm text-slate-500">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-slate-300 bg-slate-700/50 px-3 py-1 rounded-lg text-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {product.discountPrice ? (
                          <div>
                            <span className="font-semibold text-white">₹{product.discountPrice}</span>
                            <span className="text-slate-500 line-through ml-2 text-sm">
                              ₹{product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="font-semibold text-white">₹{product.price}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{product.totalStock}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            product.isActive 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {product.isActive ? (
                            <>
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5"></span>
                              Active
                            </>
                          ) : (
                            <>
                              <FiPause className="mr-1" size={10} />
                              Paused
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-1">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                            title="View"
                          >
                            <FiEye size={18} />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(product.slug, product.isActive)}
                            className={`p-2 rounded-lg transition-all ${
                              product.isActive 
                                ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/10' 
                                : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                            title={product.isActive ? 'Pause' : 'Activate'}
                          >
                            {product.isActive ? <FiPause size={18} /> : <FiPlay size={18} />}
                          </button>
                          <Link
                            href={`/admin/products/${product.slug}/edit`}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.slug)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <FiPackage className="mx-auto mb-4 text-slate-600" size={48} />
                    <p className="text-slate-400 text-lg">No products found</p>
                    <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or add a new product</p>
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
