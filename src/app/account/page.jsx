'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiPackage, 
  FiHeart, 
  FiClock, 
  FiCheckCircle,
  FiEdit3,
  FiLogOut,
  FiShoppingBag,
  FiDollarSign,
  FiPlus,
  FiTrash2,
  FiSave,
  FiX,
  FiChevronRight,
  FiStar,
  FiGift,
  FiShield
} from 'react-icons/fi';

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ name: '', phone: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [status, router]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();

      if (res.ok) {
        setUserData(data.user);
        setStats(data.stats);
        setEditedData({ name: data.user.name, phone: data.user.phone || '' });
      } else {
        toast.error(data.error || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      const data = await res.json();

      if (res.ok) {
        setUserData(prev => ({ ...prev, ...editedData }));
        setIsEditing(false);
        await update({ name: editedData.name });
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || 
        !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      const updatedAddresses = [...(userData.addresses || []), newAddress];
      
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });

      if (res.ok) {
        setUserData(prev => ({ ...prev, addresses: updatedAddresses }));
        setShowAddressModal(false);
        setNewAddress({
          fullName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pincode: '',
          isDefault: false
        });
        toast.success('Address added successfully!');
      } else {
        toast.error('Failed to add address');
      }
    } catch (error) {
      toast.error('Failed to add address');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    const updatedAddresses = userData.addresses.filter((_, i) => i !== index);
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });

      if (res.ok) {
        setUserData(prev => ({ ...prev, addresses: updatedAddresses }));
        toast.success('Address deleted successfully!');
      } else {
        toast.error('Failed to delete address');
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-yellow-400/30 rounded-full animate-spin" />
          <div className="absolute inset-0 w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">Unable to load profile</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: FiShoppingBag,
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      color: 'from-yellow-400 to-amber-500',
      bgGlow: 'shadow-yellow-500/25'
    },
    {
      icon: FiDollarSign,
      label: 'Total Spent',
      value: `₹${(stats?.totalSpent || 0).toLocaleString()}`,
      color: 'from-emerald-400 to-green-500',
      bgGlow: 'shadow-emerald-500/25'
    },
    {
      icon: FiCheckCircle,
      label: 'Delivered',
      value: stats?.deliveredOrders || 0,
      color: 'from-blue-400 to-cyan-500',
      bgGlow: 'shadow-blue-500/25'
    },
    {
      icon: FiClock,
      label: 'Pending',
      value: stats?.pendingOrders || 0,
      color: 'from-purple-400 to-violet-500',
      bgGlow: 'shadow-purple-500/25'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-10">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-float animation-delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-400/5 to-amber-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="mb-10 animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                My <span className="text-gradient-yellow">Account</span>
              </h1>
              <p className="text-gray-400">Manage your profile and preferences</p>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 rounded-full border border-red-500/20 hover:bg-red-500/20 transition-all group"
            >
              <FiLogOut className="group-hover:rotate-12 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-card-dark rounded-3xl p-6 md:p-8 mb-8 animate-fadeInUp animation-delay-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-1 shadow-2xl shadow-yellow-500/30">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  <span className="text-4xl font-bold text-yellow-400">
                    {userData.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
                <FiCheckCircle size={14} className="text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4 max-w-md">
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="Full Name"
                  />
                  <input
                    type="tel"
                    value={editedData.phone}
                    onChange={(e) => setEditedData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="Phone Number"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
                    >
                      <FiSave size={18} />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData({ name: userData.name, phone: userData.phone || '' });
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-colors"
                    >
                      <FiX size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                    {userData.role === 'admin' && (
                      <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-400/30">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400">
                    <span className="flex items-center gap-2">
                      <FiMail size={16} className="text-yellow-400" />
                      {userData.email}
                    </span>
                    {userData.phone && (
                      <span className="flex items-center gap-2">
                        <FiPhone size={16} className="text-yellow-400" />
                        {userData.phone}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Member since {formatDate(userData.createdAt)}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 text-yellow-400 rounded-xl border border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                  >
                    <FiEdit3 size={16} />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div 
              key={stat.label}
              className={`glass-card-dark rounded-2xl p-5 hover:scale-105 transition-all duration-300 animate-fadeInUp cursor-pointer group shadow-xl ${stat.bgGlow}`}
              style={{ animationDelay: `${150 + index * 50}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                <stat.icon size={22} className="text-white" />
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-fadeInUp animation-delay-300">
          {[
            { id: 'overview', label: 'Overview', icon: FiUser },
            { id: 'addresses', label: 'Addresses', icon: FiMapPin },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/25'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fadeInUp animation-delay-400">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="glass-card-dark rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FiStar className="text-yellow-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link 
                    href="/orders"
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                        <FiPackage className="text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">My Orders</p>
                        <p className="text-gray-500 text-sm">Track your orders</p>
                      </div>
                    </div>
                    <FiChevronRight className="text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link 
                    href="/wishlist"
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-400/20 rounded-lg flex items-center justify-center">
                        <FiHeart className="text-red-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Wishlist</p>
                        <p className="text-gray-500 text-sm">{userData.wishlistCount} saved items</p>
                      </div>
                    </div>
                    <FiChevronRight className="text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link 
                    href="/products"
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center">
                        <FiGift className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Browse Products</p>
                        <p className="text-gray-500 text-sm">Explore our collection</p>
                      </div>
                    </div>
                    <FiChevronRight className="text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Account Security */}
              <div className="glass-card-dark rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FiShield className="text-yellow-400" />
                  Account Info
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <FiUser className="text-gray-400" />
                      <span className="text-gray-400 text-sm">Full Name</span>
                    </div>
                    <p className="text-white font-medium">{userData.name}</p>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <FiMail className="text-gray-400" />
                      <span className="text-gray-400 text-sm">Email Address</span>
                    </div>
                    <p className="text-white font-medium">{userData.email}</p>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <FiPhone className="text-gray-400" />
                      <span className="text-gray-400 text-sm">Phone Number</span>
                    </div>
                    <p className="text-white font-medium">{userData.phone || 'Not added'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="glass-card-dark rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FiMapPin className="text-yellow-400" />
                  Saved Addresses
                </h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-colors"
                >
                  <FiPlus size={18} />
                  Add New
                </button>
              </div>

              {userData.addresses?.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {userData.addresses.map((address, index) => (
                    <div 
                      key={index}
                      className="relative p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-colors group"
                    >
                      {address.isDefault && (
                        <span className="absolute top-3 right-3 px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full">
                          Default
                        </span>
                      )}
                      <h4 className="font-semibold text-white mb-2">{address.fullName}</h4>
                      <p className="text-gray-400 text-sm">{address.phone}</p>
                      <p className="text-gray-400 text-sm mt-2">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <button
                        onClick={() => handleDeleteAddress(index)}
                        className="absolute bottom-3 right-3 p-2 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg transition-all"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMapPin size={28} className="text-gray-600" />
                  </div>
                  <p className="text-gray-400 mb-4">No addresses saved yet</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-5 py-2.5 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-colors"
                  >
                    Add Your First Address
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeInUp">
          <div className="glass-card-dark rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Add New Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Full Name *</label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Phone *</label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Address Line 1 *</label>
                <input
                  type="text"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition-colors"
                  placeholder="House/Flat number, Street"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Address Line 2</label>
                <input
                  type="text"
                  value={newAddress.addressLine2}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition-colors"
                  placeholder="Landmark (optional)"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">City *</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">State *</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Pincode *</label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="6-digit"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-gray-400">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-600 text-yellow-400 focus:ring-yellow-400"
                />
                Set as default address
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddAddress}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
                >
                  <FiSave size={18} />
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="px-5 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
