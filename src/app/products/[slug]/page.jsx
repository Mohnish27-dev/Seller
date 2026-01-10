'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FiHeart, FiShare2, FiMinus, FiPlus, FiTruck, FiShield } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.slug}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
        if (data.product.sizes?.length > 0) {
          setSelectedSize(data.product.sizes[0].size);
        }
        if (data.product.colors?.length > 0) {
          setSelectedColor(data.product.colors[0].name);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addItem(product, quantity, selectedSize, selectedColor);
    toast.success('Added to cart!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2 aspect-[3/4] bg-gray-200 rounded-xl" />
          <div className="md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
      </div>
    );
  }

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Images */}
        <div className="lg:w-1/2">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
            <Image
              src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                -{discountPercent}%
              </span>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                    selectedImage === index ? 'ring-2 ring-pink-600' : ''
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <p className="text-sm text-pink-600 uppercase tracking-wide mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center space-x-4 mb-6">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-bold text-pink-600">
                  ₹{product.discountPrice.toLocaleString()}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                  Save ₹{(product.price - product.discountPrice).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-pink-600">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    disabled={s.stock === 0}
                    className={`px-4 py-2 rounded-lg border transition ${
                      selectedSize === s.size
                        ? 'bg-pink-600 text-white border-pink-600'
                        : s.stock === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:border-pink-600'
                    }`}
                  >
                    {s.size}
                    {s.stock === 0 && ' (Out of Stock)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Select Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition ${
                      selectedColor === c.name
                        ? 'border-pink-600 bg-pink-50'
                        : 'hover:border-gray-400'
                    }`}
                  >
                    {c.hexCode && (
                      <span
                        className="w-5 h-5 rounded-full border"
                        style={{ backgroundColor: c.hexCode }}
                      />
                    )}
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-100"
              >
                <FiMinus />
              </button>
              <span className="text-xl font-medium w-10 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-100"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button onClick={handleAddToCart} className="btn-primary flex-1">
              Add to Cart
            </button>
            <button className="btn-outline flex items-center justify-center space-x-2">
              <FiHeart />
              <span>Wishlist</span>
            </button>
            <button
              onClick={handleShare}
              className="p-3 border rounded-lg hover:bg-gray-100"
            >
              <FiShare2 />
            </button>
          </div>

          {/* WhatsApp Order */}
          <a
            href={`https://wa.me/919999999999?text=Hi! I want to order: ${product.name} (${selectedSize}) - ₹${product.discountPrice || product.price}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition mb-6"
          >
            <FaWhatsapp size={24} />
            <span>Order via WhatsApp</span>
          </a>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <FiTruck className="text-pink-600" size={24} />
              <div>
                <p className="font-medium">Free Delivery</p>
                <p className="text-sm text-gray-500">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiShield className="text-pink-600" size={24} />
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-sm text-gray-500">7 days return policy</p>
              </div>
            </div>
          </div>

          {/* Fabric Info */}
          {product.fabric && (
            <div className="mt-6 p-4 border rounded-xl">
              <h3 className="font-semibold mb-2">Fabric Details</h3>
              <p className="text-gray-600">{product.fabric}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
