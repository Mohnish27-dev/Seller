'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi';
import useWishlistStore from '@/store/wishlistStore';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, loading, fetchWishlist, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status, router, fetchWishlist]);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    await removeItem(productId);
    setRemovingId(null);
  };

  const handleAddToCart = (product) => {
    const defaultSize = product.sizes?.[0]?.size || 'Free Size';
    const defaultColor = product.colors?.[0]?.name || '';
    addToCart(product, 1, defaultSize, defaultColor);
    toast.success('Added to cart!');
  };

  const handleMoveToCart = async (product) => {
    handleAddToCart(product);
    await removeItem(product._id);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 py-10">
          <div className="container mx-auto px-4">
            <div className="h-8 w-48 bg-yellow-200/50 rounded animate-pulse" />
            <div className="h-4 w-24 bg-yellow-200/50 rounded animate-pulse mt-2" />
          </div>
        </div>
        
        {/* Grid Skeleton */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Animated Header */}
      <div className="bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100 py-10 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl animate-pulse animation-delay-500" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-lg">
              <FiHeart className="text-yellow-500 w-8 h-8" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {items.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center animate-pulse">
                <FiHeart size={48} className="text-yellow-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce animation-delay-300" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-amber-300 rounded-full animate-bounce animation-delay-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Start adding your favorite items to save them for later and never miss a deal!
            </p>
            <Link
              href="/products"
              className="group bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Explore Products
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product, index) => {
              const discountPercent = product.discountPrice
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : 0;

              return (
                <div
                  key={product._id}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                    removingId === product._id ? 'opacity-50 scale-95' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Image Container */}
                  <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <Image
                      src={product.images?.[0]?.url || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    
                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        -{discountPercent}% OFF
                      </span>
                    )}

                    {/* Wishlist Heart Indicator */}
                    <div className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                      <FiHeart size={18} className="text-red-500" fill="currentColor" />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <span className="text-white font-medium flex items-center gap-2">
                        View Details <FiArrowRight />
                      </span>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-yellow-600 uppercase tracking-wider font-semibold mb-1">
                      {product.category}
                    </p>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-semibold text-gray-800 truncate hover:text-yellow-500 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mt-2">
                      {product.discountPrice ? (
                        <>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{product.discountPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {product.sizes.slice(0, 4).map((s) => (
                          <span
                            key={s.size}
                            className="text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full"
                          >
                            {s.size}
                          </span>
                        ))}
                        {product.sizes.length > 4 && (
                          <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                      >
                        <FiShoppingCart size={16} />
                        <span className="hidden sm:inline">Move to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                      <button
                        onClick={() => handleRemove(product._id)}
                        disabled={removingId === product._id}
                        className="p-2.5 border-2 border-gray-200 text-gray-400 rounded-xl hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                        title="Remove from wishlist"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Continue Shopping */}
        {items.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-500 font-medium transition-colors"
            >
              Continue Shopping
              <FiArrowRight className="hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
