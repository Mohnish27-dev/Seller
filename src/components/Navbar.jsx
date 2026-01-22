'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart, FiChevronDown } from 'react-icons/fi';
import useCartStore from '@/store/cartStore';

const categories = [
  { name: 'Salwar', slug: 'salwar' },
  { name: 'Suit', slug: 'suit' },
  { name: 'Kurti', slug: 'kurti' },
  { name: 'Maxi', slug: 'maxi' },
  { name: 'Gown', slug: 'gown' },
  { name: 'Legging', slug: 'legging' },
  { name: 'Dupatta', slug: 'dupatta' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-card-light shadow-lg' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      {/* Top bar */}
      <div className="bg-black text-yellow-400 text-center py-2 text-sm font-medium animate-fadeInUp">
        🎉 Free Shipping on orders above ₹999 
      </div>

      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 group">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold text-black">G</span>
            </div>
            <span className="text-black group-hover:text-yellow-400 transition-colors">
              Ladies<span className="text-yellow-400">Garments</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 glass-card-light rounded-full focus-glow-yellow transition-smooth"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            </div>
          </form>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/wishlist" className="text-gray-700 hover:text-yellow-400 transition-smooth hover:scale-110">
              <FiHeart size={24} />
            </Link>

            <Link href="/cart" className="relative text-gray-700 hover:text-yellow-400 transition-smooth hover:scale-110">
              <FiShoppingCart size={24} />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-scaleIn">
                  {cartItems}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-yellow-400 transition-smooth">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FiUser size={16} className="text-black" />
                  </div>
                  <span className="text-sm font-medium">{session.user.name?.split(' ')[0]}</span>
                  <FiChevronDown size={16} />
                </button>
                <div className="absolute right-0 mt-2 w-48 glass-card-light rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 animate-fadeInUp">
                  <Link href="/account" className="block px-4 py-2 text-gray-700 hover:text-yellow-400 hover:bg-yellow-400/10 transition-smooth">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:text-yellow-400 hover:bg-yellow-400/10 transition-smooth">
                    My Orders
                  </Link>
                  {session.user.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:text-yellow-400 hover:bg-yellow-400/10 transition-smooth">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-smooth"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="bg-black text-yellow-400 px-6 py-2 rounded-full font-medium hover:bg-gray-900 transition-smooth hover:scale-105">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-yellow-400 transition-smooth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:flex items-center space-x-8 py-3 border-t border-gray-200">
          <Link href="/products" className="text-gray-800 hover:text-yellow-400 font-semibold transition-smooth">
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="text-gray-600 hover:text-yellow-400 transition-smooth relative group"
            >
              {cat.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 glass-card-light rounded-b-xl animate-fadeInUp">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 glass-card rounded-full focus-glow-yellow"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              </div>
            </form>

            <div className="space-y-2">
              <Link href="/products" className="block py-2 text-gray-800 font-semibold hover:text-yellow-400 transition-smooth">
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="block py-2 text-gray-600 hover:text-yellow-400 transition-smooth"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 flex items-center space-x-4">
                <Link href="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-yellow-400 transition-smooth">
                  <FiShoppingCart size={20} />
                  <span>Cart ({cartItems})</span>
                </Link>
                {session ? (
                  <>
                    <Link href="/account" className="text-gray-600 hover:text-yellow-400 transition-smooth">Account</Link>
                    <button onClick={() => signOut()} className="text-red-600">Logout</button>
                  </>
                ) : (
                  <Link href="/login" className="text-yellow-400 font-semibold">Login</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
