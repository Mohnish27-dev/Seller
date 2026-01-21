'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, toggleItem, fetchWishlist, initialized } = useWishlistStore();

  useEffect(() => {
    if (session && !initialized) {
      fetchWishlist();
    }
  }, [session, initialized, fetchWishlist]);

  const isInWishlist = wishlistItems.some(
    (item) => (item._id || item) === product._id
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add with default size and color
    const defaultSize = product.sizes?.[0]?.size || 'Free Size';
    const defaultColor = product.colors?.[0]?.name || '';
    
    addItem(product, 1, defaultSize, defaultColor);
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    await toggleItem(product._id);
  };

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="glass-card-light rounded-2xl overflow-hidden shadow-md hover-lift hover-glow-yellow transition-smooth">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={product.images?.[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-500 ${product.totalStock === 0 ? 'opacity-70' : ''}`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Out of Stock Badge */}
          {product.totalStock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
          
          {/* Discount Badge */}
          {discountPercent > 0 && product.totalStock > 0 && (
            <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full animate-scaleIn glow-yellow">
              -{discountPercent}%
            </span>
          )}
          
          {/* Low Stock Warning */}
          {product.totalStock > 0 && product.totalStock < 10 && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Only {product.totalStock} left!
            </span>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              className={`p-2 glass-card rounded-full shadow-md transition-smooth animate-scaleIn ${
                isInWishlist 
                  ? 'bg-red-500 text-white' 
                  : 'hover:bg-yellow-400 hover:text-black'
              }`}
              onClick={handleToggleWishlist}
            >
              <FiHeart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
            <button 
              className="p-2 glass-card rounded-full shadow-md hover:bg-yellow-400 hover:text-black transition-smooth animate-scaleIn animation-delay-100"
            >
              <FiEye size={18} />
            </button>
          </div>

          {/* Glassmorphism Overlay on Hover - Only show if in stock */}
          {product.totalStock > 0 && (
            <div className="absolute inset-0 glass-card-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={handleAddToCart}
                className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold flex items-center space-x-2 hover:bg-yellow-300 transition-smooth hover:scale-110 glow-yellow-lg"
              >
                <FiShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 font-medium">
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-yellow-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2 mt-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-yellow-400">
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

          {/* Sizes Available */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {product.sizes.slice(0, 4).map((s) => (
                <span key={s.size} className="text-xs text-gray-600 border border-gray-300 px-2 py-1 rounded-full hover:border-yellow-400 hover:text-yellow-400 transition-smooth">
                  {s.size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs text-gray-500 font-medium">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
