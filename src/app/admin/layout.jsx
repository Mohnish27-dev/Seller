'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPackage, FiShoppingBag, FiUsers, FiGrid, FiSettings, FiLogOut } from 'react-icons/fi';
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (session?.user?.role !== 'admin') {
    return null;
  }

  const navItems = [
    { href: '/admin', icon: FiGrid, label: 'Dashboard' },
    { href: '/admin/products', icon: FiShoppingBag, label: 'Products' },
    { href: '/admin/orders', icon: FiPackage, label: 'Orders' },
    { href: '/admin/customers', icon: FiUsers, label: 'Customers' },
    { href: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen fixed left-0 top-0">
          <div className="p-6">
            <Link href="/admin" className="text-xl font-bold text-white">
              Admin Panel
            </Link>
          </div>

          <nav className="mt-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition w-full mt-4"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Link
              href="/"
              className="block text-center text-sm text-gray-400 hover:text-white"
            >
              ← Back to Store
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </div>
  );
}
