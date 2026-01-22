'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';

// Force dynamic rendering to prevent prerendering issues with useSearchParams
export const dynamic = 'force-dynamic';

const categories = [
  { name: 'All', slug: '' },
  { name: 'Salwar', slug: 'salwar' },
  { name: 'Suit', slug: 'suit' },
  { name: 'Kurti', slug: 'kurti' },
  { name: 'Maxi', slug: 'maxi' },
  { name: 'Gown', slug: 'gown' },
  { name: 'Legging', slug: 'legging' },
  { name: 'Dupatta', slug: 'dupatta' },
];

const sortOptions = [
  { name: 'Newest First', value: 'createdAt-desc' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
  { name: 'Most Popular', value: 'soldCount-desc' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [sort, order] = sortBy.split('-');
      const params = new URLSearchParams({
        sort,
        order,
        page: '1',
        limit: '12',
      });

      if (selectedCategory) {
        params.set('category', selectedCategory);
      }

      const search = searchParams.get('search');
      if (search) {
        params.set('search', search);
      }

      const featured = searchParams.get('featured');
      if (featured) {
        params.set('featured', featured);
      }

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-yellow-100 to-amber-100 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {selectedCategory 
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Collection`
              : 'All Products'
            }
          </h1>
          <p className="text-gray-600 mt-2">
            {pagination.total} products found
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === cat.slug
                        ? 'bg-yellow-100 text-yellow-600 font-bold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow"
              >
                <FiFilter />
                <span>Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white rounded-lg shadow border-none focus:ring-2 focus:ring-yellow-400"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found</p>
                <button
                  onClick={() => setSelectedCategory('')}
                  className="mt-4 text-yellow-600 hover:underline font-semibold"
                >
                  View all products
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-10 space-x-2">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    className={`w-10 h-10 rounded-lg ${
                      pagination.page === i + 1
                        ? 'bg-yellow-400 text-black font-bold'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <FiX size={24} />
              </button>
            </div>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    selectedCategory === cat.slug
                      ? 'bg-yellow-100 text-yellow-600 font-bold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 py-10">
          <div className="container mx-auto px-4">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mt-2"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
