'use client';

import { useState } from 'react';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin } from 'react-icons/fi';

const orderStatuses = {
  'pending': { icon: FiClock, label: 'Order Placed', color: 'text-yellow-500', bg: 'bg-yellow-100' },
  'processing': { icon: FiPackage, label: 'Processing', color: 'text-blue-500', bg: 'bg-blue-100' },
  'shipped': { icon: FiTruck, label: 'Shipped', color: 'text-purple-500', bg: 'bg-purple-100' },
  'delivered': { icon: FiCheckCircle, label: 'Delivered', color: 'text-green-500', bg: 'bg-green-100' },
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Order not found');
      }
      
      setOrderDetails(data);
    } catch (err) {
      setError(err.message || 'Unable to find order. Please check your order ID.');
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    return statuses.indexOf(status?.toLowerCase() || 'pending');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      {/* Hero Section */}
      <section className="relative pb-12 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-yellow-400/10 rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="text-center max-w-2xl mx-auto animate-fadeInUp">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 glow-yellow">
              <FiPackage className="text-black" size={40} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Track Your <span className="text-gradient-yellow">Order</span>
            </h1>
            <p className="text-gray-300">
              Enter your order ID to see the current status and delivery updates
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-8">
        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleTrackOrder} className="animate-fadeInUp animation-delay-200">
            <div className="glass-card-light rounded-2xl p-8 hover-lift">
              <label className="block text-gray-700 font-medium mb-2">Order ID</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter your order ID (e.g., 507f1f77bcf86cd799439011)"
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus-glow-yellow transition-smooth text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-smooth hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FiSearch size={20} />
                      Track
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && searched && (
          <div className="max-w-2xl mx-auto mb-8 animate-fadeInUp">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Order Not Found</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Order Details */}
        {orderDetails && (
          <div className="max-w-4xl mx-auto animate-fadeInUp animation-delay-300">
            {/* Order Status Card */}
            <div className="glass-card-yellow rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Order #{orderDetails._id?.slice(-8)?.toUpperCase()}</h2>
                  <p className="text-gray-600">
                    Placed on {new Date(orderDetails.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${orderStatuses[orderDetails.status?.toLowerCase()]?.bg || 'bg-gray-100'} mt-4 md:mt-0`}>
                  {orderStatuses[orderDetails.status?.toLowerCase()]?.icon && 
                    <span className={orderStatuses[orderDetails.status?.toLowerCase()]?.color}>
                      {(() => {
                        const IconComponent = orderStatuses[orderDetails.status?.toLowerCase()]?.icon;
                        return <IconComponent size={18} />;
                      })()}
                    </span>
                  }
                  <span className={`font-medium ${orderStatuses[orderDetails.status?.toLowerCase()]?.color || 'text-gray-600'}`}>
                    {orderStatuses[orderDetails.status?.toLowerCase()]?.label || orderDetails.status}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative">
                <div className="flex justify-between items-center">
                  {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                    const currentIndex = getStatusIndex(orderDetails.status);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const StatusIcon = orderStatuses[status].icon;
                    
                    return (
                      <div key={status} className="flex flex-col items-center relative z-10">
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-yellow-400 glow-yellow' 
                              : 'bg-gray-200'
                          } ${isCurrent ? 'scale-110' : ''}`}
                        >
                          <StatusIcon 
                            size={24} 
                            className={isCompleted ? 'text-black' : 'text-gray-400'}
                          />
                        </div>
                        <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {orderStatuses[status].label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Progress Line */}
                <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 -z-0">
                  <div 
                    className="h-full bg-yellow-400 transition-all duration-700"
                    style={{ width: `${(getStatusIndex(orderDetails.status) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="glass-card-light rounded-2xl p-8 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiPackage className="text-yellow-500" />
                Order Items
              </h3>
              <div className="space-y-4">
                {orderDetails.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">👗</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-yellow-600">₹{orderDetails.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {orderDetails.shippingAddress && (
              <div className="glass-card-light rounded-2xl p-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiMapPin className="text-yellow-500" />
                  Shipping Address
                </h3>
                <div className="text-gray-600">
                  <p className="font-medium text-gray-800">{orderDetails.shippingAddress.name}</p>
                  <p>{orderDetails.shippingAddress.address}</p>
                  <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.pincode}</p>
                  <p className="mt-2">Phone: {orderDetails.shippingAddress.phone}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-2xl mx-auto mt-12 animate-fadeInUp animation-delay-400">
          <div className="glass-card-light rounded-2xl p-8 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-6">
              If you have any questions about your order, feel free to reach out to us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+918317052176"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-100 text-yellow-700 rounded-xl font-medium hover:bg-yellow-200 transition-smooth"
              >
                📞 +91 8317052176
              </a>
              <a 
                href="mailto:inderkumarpamnani@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-smooth"
              >
                ✉️ Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
