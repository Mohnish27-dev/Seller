'use client';

import { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiEye, 
  FiPackage, 
  FiX,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const statusOptions = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/admin/orders?status=${selectedStatus}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, trackingNumber = '') => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus, trackingNumber }),
      });

      if (res.ok) {
        toast.success('Order updated');
        fetchOrders();
        setSelectedOrder(null);
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-500/20 text-amber-400',
      confirmed: 'bg-blue-500/20 text-blue-400',
      processing: 'bg-cyan-500/20 text-cyan-400',
      shipped: 'bg-violet-500/20 text-violet-400',
      delivered: 'bg-emerald-500/20 text-emerald-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FiClock size={12} />;
      case 'delivered': return <FiCheckCircle size={12} />;
      case 'shipped': return <FiTruck size={12} />;
      case 'cancelled': return <FiXCircle size={12} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Orders</h1>
        <p className="text-slate-400 mt-1">Manage and track customer orders</p>
      </div>

      {/* Status Filters */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl capitalize transition-all font-medium ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
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
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Date
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
                    <td colSpan={8} className="px-6 py-4">
                      <div className="h-12 bg-slate-700/50 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{order.user?.name || order.shippingAddress?.fullName}</p>
                        <p className="text-sm text-slate-500">{order.shippingAddress?.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{order.items?.length || 0} items</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">₹{order.totalAmount?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <FiPackage className="mx-auto mb-4 text-slate-600" size={48} />
                    <p className="text-slate-400 text-lg">No orders found</p>
                    <p className="text-slate-500 text-sm mt-1">Orders matching the selected filter will appear here</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-white mb-3">Shipping Address</h3>
                <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-sm">
                  <p className="font-medium text-white">{selectedOrder.shippingAddress?.fullName}</p>
                  <p className="text-slate-400">{selectedOrder.shippingAddress?.phone}</p>
                  <p className="text-slate-400">{selectedOrder.shippingAddress?.addressLine1}</p>
                  {selectedOrder.shippingAddress?.addressLine2 && (
                    <p className="text-slate-400">{selectedOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-slate-400">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{' '}
                    {selectedOrder.shippingAddress?.pincode}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-white mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-xl p-4">
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-slate-400">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-slate-700 pt-4">
                <div className="flex justify-between mb-2 text-slate-300">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.itemsTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2 text-slate-300">
                  <span>Shipping</span>
                  <span>₹{selectedOrder.shippingCharge}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-white pt-2 border-t border-slate-700">
                  <span>Total</span>
                  <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Update Status */}
              <div className="border-t border-slate-700 pt-4">
                <h3 className="font-semibold text-white mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder._id, status)}
                      disabled={selectedOrder.orderStatus === status}
                      className={`px-4 py-2 rounded-xl capitalize transition-all font-medium ${
                        selectedOrder.orderStatus === status
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
