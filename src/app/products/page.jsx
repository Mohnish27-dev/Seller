import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

function ProductsLoading() {
  return (
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
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
