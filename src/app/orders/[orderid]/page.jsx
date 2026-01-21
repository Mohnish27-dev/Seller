"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  FiPackage, 
  FiMapPin, 
  FiCreditCard, 
  FiArrowLeft,
  FiCheck,
  FiTruck,
  FiClock,
  FiBox,
  FiCheckCircle
} from "react-icons/fi";

export default function OrderDetailPage() {
  const { orderid } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderid) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderid}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderid]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: FiClock,
        text: 'Order Pending',
        description: 'Your order is being reviewed'
      },
      confirmed: { 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: FiCheck,
        text: 'Order Confirmed',
        description: 'Your order has been confirmed'
      },
      processing: { 
        color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
        icon: FiBox,
        text: 'Processing',
        description: 'Your order is being prepared'
      },
      shipped: { 
        color: 'bg-violet-100 text-violet-700 border-violet-200',
        icon: FiTruck,
        text: 'Shipped',
        description: 'Your order is on the way'
      },
      delivered: { 
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: FiCheckCircle,
        text: 'Delivered',
        description: 'Your order has been delivered'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: FiClock,
        text: 'Cancelled',
        description: 'Your order has been cancelled'
      },
    };
    return configs[status] || configs.pending;
  };

  const getOrderProgress = (status) => {
    const stages = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = stages.indexOf(status);
    return { stages, currentIndex };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto text-center py-16">
          <FiPackage className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link 
            href="/orders" 
            className="inline-flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
          >
            <FiArrowLeft />
            <span>Back to Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto text-center py-16">
          <FiPackage className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <Link 
            href="/orders" 
            className="inline-flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
          >
            <FiArrowLeft />
            <span>Back to Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;
  const { stages, currentIndex } = getOrderProgress(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/orders" 
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
            >
              <FiArrowLeft />
              <span>Back to Orders</span>
            </Link>
            <span className="text-sm text-gray-500">
              Order placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Order Number & Status Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                  <p className="text-gray-500 mt-1">Track your order status below</p>
                </div>
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${statusConfig.color}`}>
                  <StatusIcon size={18} />
                  <span className="font-semibold">{statusConfig.text}</span>
                </div>
              </div>
            </div>

            {/* Order Progress Tracker */}
            {order.orderStatus !== 'cancelled' && (
              <div className="p-6 bg-gray-50">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                      style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
                    />
                  </div>

                  {/* Progress Steps */}
                  <div className="relative flex justify-between">
                    {stages.map((stage, index) => {
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      return (
                        <div key={stage} className="flex flex-col items-center">
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-yellow-400 border-yellow-400 text-black' 
                                : 'bg-white border-gray-300 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-yellow-100 scale-110' : ''}`}
                          >
                            {isCompleted ? <FiCheck size={18} /> : <span className="text-sm">{index + 1}</span>}
                          </div>
                          <span className={`mt-2 text-xs font-medium capitalize ${
                            isCompleted ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-center text-gray-600 mt-6">
                  {statusConfig.description}
                </p>
              </div>
            )}

            {/* Cancelled Status */}
            {order.orderStatus === 'cancelled' && (
              <div className="p-6 bg-red-50 text-center">
                <p className="text-red-600 font-medium">This order has been cancelled</p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <FiMapPin className="text-yellow-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="space-y-1 text-gray-600">
                <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiCreditCard className="text-green-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>
                  <span className={`font-medium capitalize ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="text-gray-900 font-semibold">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FiPackage className="text-purple-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                  <p className="text-sm text-gray-500">{order.items?.length} item(s)</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          Size: {item.size}
                        </span>
                        <span className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <p className="mt-2 font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="space-y-2 max-w-xs ml-auto">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order.itemsTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm">
              If you have any questions about your order, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
