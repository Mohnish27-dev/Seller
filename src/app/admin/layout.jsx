'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiGrid, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiChevronRight,
  FiTrendingUp,
  FiHome
} from 'react-icons/fi';
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  // Close sidebar when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Don't apply layout to login page
  if (pathname === '/admin/login') {
    return children;
  }

  if (status === 'loading') {
    return (
      <>
        {/* Hide main navbar/footer */}
        <style jsx global>{`
          body > div > nav:not(.admin-nav),
          body > div > footer,
          header:not(.admin-header),
          main > nav {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
          }
        `}</style>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center fixed inset-0 z-[100]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      </>
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
    { href: '/admin/analytics', icon: FiTrendingUp, label: 'Analytics' },
    { href: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const getCurrentPageTitle = () => {
    const currentNav = navItems.find(item => isActive(item.href));
    return currentNav?.label || 'Admin';
  };

  return (
    <>
      {/* Hide main navbar/footer globally for admin pages */}
      <style jsx global>{`
        body > div > nav:not(.admin-nav),
        body > div > footer,
        header:not(.admin-header),
        main > nav {
          display: none !important;
        }
        main.flex-grow {
          margin: 0 !important;
          padding: 0 !important;
          flex-grow: 0 !important;
        }
      `}</style>

      <div className="min-h-screen bg-slate-900 fixed inset-0 z-[100] overflow-auto">
        {/* Top Header Bar */}
        <header className="admin-header bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Hamburger Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 group"
            >
              <FiMenu size={22} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Page Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FiShoppingBag className="text-white" size={16} />
              </div>
              <span className="text-white font-semibold">{getCurrentPageTitle()}</span>
            </div>

            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Drawer */}
        <aside className={`
          fixed left-0 top-0 h-full w-80 bg-slate-950 border-r border-slate-800 z-[60]
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-3" onClick={() => setSidebarOpen(false)}>
              <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <FiShoppingBag className="text-white" size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-slate-500">Management Dashboard</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <FiX size={22} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive(item.href) 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }
                `}
              >
                <item.icon size={20} className={isActive(item.href) ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'} />
                <span className="font-medium">{item.label}</span>
                {isActive(item.href) && (
                  <FiChevronRight className="ml-auto text-cyan-400" size={16} />
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-950 space-y-2">
            {/* User Info */}
            <div className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{session?.user?.name || 'Admin'}</p>
                <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium"
              >
                <FiHome size={16} />
                <span>Store</span>
              </Link>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all text-sm font-medium"
              >
                <FiLogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-60px)]">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <FiLogOut className="text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Logout</h3>
                  <p className="text-sm text-slate-400">End your session</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6">
                Are you sure you want to logout from the admin panel?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
