'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiCheckCircle, 
  FiPackage, 
  FiTruck, 
  FiHome,
  FiArrowRight,
  FiShoppingBag
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const { orderid } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // WhatsApp number for support
  const WHATSAPP_NUMBER = '+918317052176';

  useEffect(() => {
    // Trigger confetti animation on page load
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FACC15', '#FDE047', '#000000', '#10B981']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FACC15', '#FDE047', '#000000', '#10B981']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!orderid) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderid}`);
        if (!res.ok) throw new Error('Order not found');
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

  const getWhatsAppMessage = () => {
    if (!order) return '';
    const message = `Hi! I just placed an order on Ladies Garments.\n\nOrder ID: ${order.orderNumber}\nTotal Amount: ₹${order.totalAmount?.toLocaleString()}\n\nI would like to get updates about my order delivery. Thank you!`;
    return encodeURIComponent(message);
  };

  const getWhatsAppLink = () => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppMessage()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white">
        <div className="text-center max-w-md mx-auto px-4">
          <FiPackage className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'Unable to find your order details.'}</p>
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
          >
            <FiHome />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation Header */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="relative inline-block">
            <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce-slow">
              <FiCheckCircle className="text-white" size={60} />
            </div>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 w-28 h-28 bg-green-400 rounded-full animate-ping opacity-25 mx-auto"></div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase! Your order has been placed successfully.
          </p>
        </div>

        {/* Order ID Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 animate-fadeInUp animation-delay-100">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-2">Your Order Number</p>
            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-4 inline-block">
              <span className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wider">
                #{order.orderNumber}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Please save this order number for tracking and support queries.
            </p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 animate-fadeInUp animation-delay-200">
          <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <FiPackage className="text-yellow-500" />
            Order Summary
          </h2>
          
          {/* Order Items */}
          <div className="space-y-3 mb-4">
            {order.items?.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Size: {item.size} | Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-gray-900 text-sm">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
            {order.items?.length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                +{order.items.length - 3} more item(s)
              </p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Amount</span>
            <span className="text-xl font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>

        {/* Delivery Info Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 animate-fadeInUp animation-delay-300">
          <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <FiTruck className="text-yellow-500" />
            Delivery Information
          </h2>
          <div className="space-y-2 text-gray-600">
            <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.phone}</p>
            <p>{order.shippingAddress?.addressLine1}</p>
            {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-amber-800 text-sm">
              <strong>Expected Delivery:</strong> 5-7 business days
            </p>
          </div>
        </div>

        {/* WhatsApp Support Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 mb-6 text-white animate-fadeInUp animation-delay-400">
          <div className="text-center">
            <FaWhatsapp className="mx-auto mb-3" size={48} />
            <h2 className="font-bold text-xl mb-2">Need Help with Your Order?</h2>
            <p className="text-green-100 mb-4 text-sm">
              Contact us on WhatsApp for delivery updates, return/replacement queries, or any other support.
            </p>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition transform hover:scale-105 shadow-lg"
            >
              <FaWhatsapp size={24} />
              <span>Chat on WhatsApp</span>
            </a>
            <p className="text-green-100 text-xs mt-3">
              Available 24/7 for your queries
            </p>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 animate-fadeInUp animation-delay-500">
          <h2 className="font-semibold text-lg text-gray-900 mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Confirmation</p>
                <p className="text-sm text-gray-500">You'll receive an email confirmation shortly.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Processing & Shipping</p>
                <p className="text-sm text-gray-500">We'll prepare and ship your order within 1-2 days.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Delivery Updates</p>
                <p className="text-sm text-gray-500">Track your order or contact us via WhatsApp for updates.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animation-delay-600">
          <Link 
            href={`/orders/${orderid}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-yellow-400 text-black px-6 py-4 rounded-full font-bold hover:bg-yellow-500 transition transform hover:scale-105"
          >
            <FiPackage size={20} />
            <span>View Order Details</span>
          </Link>
          <Link 
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-4 rounded-full font-bold hover:bg-gray-200 transition transform hover:scale-105"
          >
            <FiShoppingBag size={20} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-500 text-sm animate-fadeInUp animation-delay-700">
          <p>Questions about returns or replacements?</p>
          <p className="mt-1">
            Check our{' '}
            <Link href="/return-policy" className="text-yellow-600 hover:underline">
              Return Policy
            </Link>
            {' '}or contact us on WhatsApp.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
