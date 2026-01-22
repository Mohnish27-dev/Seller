'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiArrowRight } from 'react-icons/fi';

const colors = [
  { name: 'Blue', hex: '#3B82F6', rgb: '59, 130, 246' },
  { name: 'Red', hex: '#EF4444', rgb: '239, 68, 68' },
  { name: 'Black', hex: '#000000', rgb: '0, 0, 0' },
  { name: 'Yellow', hex: '#FACC15', rgb: '250, 204, 21' },
  { name: 'White', hex: '#FFFFFF', rgb: '255, 255, 255' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

export default function HeroSection() {
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('M');

  return (
    <section className="relative min-h-screen bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 z-10">
            {/* Logo */}
            <div className="mb-8 animate-fadeInUp">
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">G</span>
                </div>
                <span className="text-xl font-semibold text-gray-800">Garments</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fadeInUp animation-delay-100">
              TRADITIONAL
              <br />
              <span className="relative inline-block">
                ELEGANCE
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-400 opacity-30"></div>
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-gray-600 text-lg mb-8 max-w-md animate-fadeInUp animation-delay-200">
              Discover Our Exclusive Collection of Salwar Suits, Kurtis, Gowns & More. Premium Quality Ethnic Wear for Every Occasion.
            </p>

            {/* Color Selector */}
            <div className="mb-6 animate-fadeInUp animation-delay-300">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                Available Colors
              </h3>
              <div className="flex gap-3">
                {colors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 animate-scaleIn`}
                    style={{
                      backgroundColor: color.hex,
                      borderColor: selectedColor === color.name ? '#000' : '#E5E7EB',
                      animationDelay: `${400 + index * 50}ms`,
                      boxShadow: selectedColor === color.name ? `0 0 0 3px rgba(${color.rgb}, 0.3)` : 'none',
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8 animate-fadeInUp animation-delay-500">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size, index) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 animate-scaleIn ${
                      selectedSize === size
                        ? 'bg-black text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-black'
                    }`}
                    style={{ animationDelay: `${600 + index * 50}ms` }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop Now Button */}
            <div className="animate-fadeInUp animation-delay-700">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <FiShoppingCart className="text-xl" />
                SHOP NOW
                <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div className="w-full lg:w-1/2 relative">
            {/* Yellow Circle Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-yellow-400 rounded-full animate-scaleIn animation-delay-200 -z-0"></div>
            
            {/* Product Image */}
            <div className="relative z-10 animate-fadeInUp animation-delay-400">
              <div className="relative w-full h-[500px] md:h-[600px]">
                <Image
                  src="/products/p1.png"
                  alt="Traditional Ethnic Wear"
                  fill
                  className="object-contain animate-kenBurns"
                  priority
                />
              </div>

              {/* Floating Product Tag 1 - Salwar Suit */}
              <div className="absolute top-[30%] left-8 bg-white px-4 py-2 rounded-lg shadow-lg animate-float animation-delay-800">
                <p className="text-xs font-semibold text-gray-500 uppercase">Salwar Suit</p>
                <p className="text-sm font-bold text-gray-900">₹2,499</p>
              </div>

              {/* Floating Product Tag 2 - Designer Kurti */}
              <div className="absolute bottom-[20%] right-8 bg-white px-4 py-2 rounded-lg shadow-lg animate-float animation-delay-1000">
                <p className="text-xs font-semibold text-gray-500 uppercase">Designer Kurti</p>
                <p className="text-sm font-bold text-gray-900">₹1,299</p>
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 animate-fadeInUp animation-delay-900">
                <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-yellow-400 transition-colors">
                  <span className="text-sm font-bold">1</span>
                </button>
                <button className="w-10 h-10 rounded-full bg-black text-white shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <span className="text-sm font-bold">2</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
