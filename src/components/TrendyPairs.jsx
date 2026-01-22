'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';

const categories = [
  { 
    name: 'Salwar', 
    href: '/products?category=salwar', 
    image: '/products/p1.png', 
    icon: '👗',
    description: 'Traditional & Trendy'
  },
  { 
    name: 'Suit', 
    href: '/products?category=suit', 
    image: '/products/p2.png', 
    icon: '✨',
    description: 'Designer Collection'
  },
  { 
    name: 'Kurti', 
    href: '/products?category=kurti', 
    image: '/products/p3.png', 
    icon: '🌸',
    description: 'Casual & Festive'
  },
  { 
    name: 'Maxi', 
    href: '/products?category=maxi', 
    image: '/products/p4.png', 
    icon: '🌺',
    description: 'Elegant Styles'
  },
  { 
    name: 'Gown', 
    href: '/products?category=gown', 
    image: '/products/p5.png', 
    icon: '👸',
    description: 'Party & Wedding'
  },
  { 
    name: 'Dupatta', 
    href: '/products?category=dupatta', 
    image: '/products/p2.png', 
    icon: '🧣',
    description: 'Matching Pairs'
  },
];

export default function TrendyPairs() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Shop by <span className="text-yellow-400">Category</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our exclusive collection of premium ladies ethnic wear for every occasion
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

                {/* Description */}
                <p className="text-xs text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>
                
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
            Explore All Products
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
