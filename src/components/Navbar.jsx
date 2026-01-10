'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart } from 'react-icons/fi';
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
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.getTotalItems());

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-primary-600 text-black text-center py-2 text-sm">
        🎉 Free Shipping on orders above ₹999 | Use code FIRST10 for 10% off
      </div>

      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            <span className="text-secondary-600">Ladies</span>Garments
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/wishlist" className="text-gray-600 hover:text-primary-600 transition">
              <FiHeart size={24} />
            </Link>

            <Link href="/cart" className="relative text-gray-600 hover:text-primary-600 transition">
              <FiShoppingCart size={24} />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <FiUser size={24} />
                  <span className="text-sm">{session.user.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <Link href="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  {session.user.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:flex items-center space-x-8 py-3 border-t">
          <Link href="/products" className="text-gray-700 hover:text-primary-600 font-medium">
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="text-gray-600 hover:text-primary-600 transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </form>

            <div className="space-y-2">
              <Link href="/products" className="block py-2 text-gray-700 font-medium">
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="block py-2 text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <div className="pt-4 border-t flex items-center space-x-4">
                <Link href="/cart" className="flex items-center space-x-2 text-gray-600">
                  <FiShoppingCart size={20} />
                  <span>Cart ({cartItems})</span>
                </Link>
                {session ? (
                  <>
                    <Link href="/account" className="text-gray-600">Account</Link>
                    <button onClick={() => signOut()} className="text-red-600">Logout</button>
                  </>
                ) : (
                  <Link href="/login" className="text-primary-600 font-medium">Login</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
