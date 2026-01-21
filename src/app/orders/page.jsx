'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiPackage, 
  FiChevronRight, 
  FiClock, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle,
  FiCheck,
  FiBox
} from 'react-icons/fi';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50',
        icon: FiClock,
        text: 'Order Pending'
      },
      confirmed: { 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50',
        icon: FiCheck,
        text: 'Confirmed'
      },
      processing: { 
        color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
        bgColor: 'bg-gradient-to-r from-cyan-50 to-teal-50',
        icon: FiBox,
        text: 'Processing'
      },
      shipped: { 
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        bgColor: 'bg-gradient-to-r from-purple-50 to-violet-50',
        icon: FiTruck,
        text: 'On the Way'
      },
      delivered: { 
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50',
        icon: FiCheckCircle,
        text: 'Delivered'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-700 border-red-200',
        bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
        icon: FiXCircle,
        text: 'Cancelled'
      },
    };
    return configs[status] || configs.pending;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="h-10 bg-gray-200 rounded-lg w-48 mb-8 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">Track and manage your orders</p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage size={40} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
              <Link 
                href="/products" 
                className="inline-flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition hover:shadow-lg hover:shadow-yellow-200"
              >
                <span>Browse Products</span>
                <FiChevronRight />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.orderStatus);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <Link
                    key={order._id}
                    href={`/orders/${order._id}`}
                    className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-yellow-200 transition-all group"
                  >
                    {/* Status Bar */}
                    <div className={`px-4 py-3 ${statusConfig.bgColor} border-b border-gray-100`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusConfig.color}`}>
                            <StatusIcon size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{statusConfig.text}</p>
                            <p className="text-xs text-gray-500">
                              {order.orderStatus === 'delivered' 
                                ? `Delivered on ${new Date(order.deliveredAt || order.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                                : order.orderStatus === 'shipped'
                                ? 'Your order is on the way'
                                : order.orderStatus === 'cancelled'
                                ? 'This order was cancelled'
                                : 'Estimated delivery in 5-7 days'
                              }
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Items Preview */}
                        <div className="flex -space-x-3">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div 
                              key={index} 
                              className="relative w-14 h-16 rounded-lg overflow-hidden border-2 border-white shadow-sm bg-gray-100"
                              style={{ zIndex: 3 - index }}
                            >
                              <Image
                                src={item.image || '/placeholder.jpg'}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div 
                              className="w-14 h-16 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-gray-500 text-xs font-medium"
                              style={{ zIndex: 0 }}
                            >
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>

                        {/* Order Summary */}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-600 text-sm truncate">
                            {order.items.map(item => item.name).join(', ')}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </p>
                        </div>

                        {/* Price & Arrow */}
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 capitalize">{order.paymentStatus}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-black transition">
                            <FiChevronRight />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
