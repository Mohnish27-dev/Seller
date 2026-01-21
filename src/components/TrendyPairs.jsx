'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';

const categories = [
  { name: 'Foot Wear', href: '/products?category=footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop', icon: '👠' },
  { name: 'Accessories', href: '/products?category=accessories', image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=300&fit=crop', icon: '👜' },
  { name: 'Casual Wear', href: '/products?category=casual', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=300&fit=crop', icon: '👕' },
  { name: 'Night Wear', href: '/products?category=nightwear', image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=300&fit=crop', icon: '🌙' },
  { name: 'Formal Wear', href: '/products?category=formal', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=300&fit=crop', icon: '👗' },
  { name: 'Sports Wear', href: '/products?category=sports', image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&h=300&fit=crop', icon: '⚡' },
];

export default function TrendyPairs() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trendy <span className="text-yellow-400">Pairs</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our curated collections designed to complement your unique style
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl bg-gray-800 hover:bg-gray-700 transition-all duration-500 animate-scaleIn hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                {/* Icon */}
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">
                  {category.icon}
                </div>
                
                {/* Category Name */}
                <h3 className="text-lg font-bold mb-1 group-hover:text-yellow-400 transition-colors">
                  {category.name}
                </h3>
                
                {/* Arrow */}
                <FiArrowRight className="text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-yellow-400 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 animate-fadeInUp animation-delay-700">
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
          >
            Explore All Collections
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
