'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import useCartStore from '@/store/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <FiShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet</p>
        <Link href="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {items.map((item, index) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className={`flex items-center p-4 ${
                  index !== items.length - 1 ? 'border-b' : ''
                }`}
              >
                {/* Image */}
                <div className="relative w-24 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 ml-4">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold text-gray-800 hover:text-yellow-400"
                  >
                    {item.name}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span className="ml-3">Color: {item.color}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-400">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.originalPrice !== item.price && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId, item.size, item.color)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="mt-4 text-red-500 hover:underline text-sm"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-500">
                  Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-yellow-400 font-bold">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn-primary w-full text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block text-center text-gray-600 hover:text-yellow-400 mt-4 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
