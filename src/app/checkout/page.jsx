'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import useCartStore from '@/store/cartStore';
import Script from 'next/script';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please login to checkout');
      router.push('/login');
    }
    if (items.length === 0 && status === 'authenticated') {
      router.push('/cart');
    }
  }, [status, items, router]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!address[field]) {
        toast.error(`Please fill ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (address.phone.length !== 10) {
      toast.error('Please enter valid 10-digit phone number');
      return false;
    }
    if (address.pincode.length !== 6) {
      toast.error('Please enter valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const createOrder = async () => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: address,
        paymentMethod,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create order');
    }
    return data.order;
  };

  const handleRazorpayPayment = async (order) => {
    // Create Razorpay order
    const res = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: order.totalAmount,
        orderId: order._id,
      }),
    });

    const razorpayOrder = await res.json();
    if (!res.ok) {
      throw new Error(razorpayOrder.error || 'Failed to create payment');
    }

    // Open Razorpay checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Ladies Garments',
      description: `Order #${order.orderNumber}`,
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          // Verify payment
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            }),
          });

          if (verifyRes.ok) {
            clearCart();
            toast.success('Payment successful!');
            router.push(`/orders/${order._id}?success=true`);
          } else {
            toast.error('Payment verification failed');
          }
        } catch (error) {
          toast.error('Payment verification failed');
        }
      },
      prefill: {
        name: address.fullName,
        contact: address.phone,
        email: session?.user?.email,
      },
      theme: {
        color: '#ec4899',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAddress()) return;

    setLoading(true);

    try {
      const order = await createOrder();

      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment(order);
      } else {
        // COD order
        clearCart();
        toast.success('Order placed successfully!');
        router.push(`/orders/${order._id}?success=true`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Shipping Address */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      className="input-field"
                      placeholder="10-digit number"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={address.addressLine1}
                      onChange={handleAddressChange}
                      className="input-field"
                      placeholder="House/Flat number, Street"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Address Line 2</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={address.addressLine2}
                      onChange={handleAddressChange}
                      className="input-field"
                      placeholder="Landmark (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      className="input-field"
                      placeholder="6-digit pincode"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-pink-600"
                    />
                    <div className="ml-3">
                      <span className="font-medium">Pay Online</span>
                      <p className="text-sm text-gray-500">
                        UPI, Credit/Debit Card, Net Banking
                      </p>
                    </div>
                    <Image
                      src="https://razorpay.com/assets/razorpay-glyph.svg"
                      alt="Razorpay"
                      width={80}
                      height={30}
                      className="ml-auto"
                    />
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-pink-600"
                    />
                    <div className="ml-3">
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-gray-500">Pay when you receive</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex items-center gap-3"
                    >
                      <div className="relative w-16 h-20 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.size} | Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total</span>
                    <span className="text-pink-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-6 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
