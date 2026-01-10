'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add with default size and color
    const defaultSize = product.sizes?.[0]?.size || 'Free Size';
    const defaultColor = product.colors?.[0]?.name || '';
    
    addItem(product, 1, defaultSize, defaultColor);
    toast.success('Added to cart!');
  };

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="product-card bg-white rounded-xl overflow-hidden shadow-md">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.images?.[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.success('Added to wishlist!');
              }}
            >
              <FiHeart className="text-gray-600 hover:text-primary-600" size={18} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-primary-600 text-white py-3 flex items-center justify-center space-x-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <FiShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-gray-800 truncate">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2 mt-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-primary-600">
                  ₹{product.discountPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary-600">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Sizes Available */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.sizes.slice(0, 4).map((s) => (
                <span key={s.size} className="text-xs text-gray-500 border px-1.5 py-0.5 rounded">
                  {s.size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
