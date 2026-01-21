'use client';

import { useState } from 'react';
import { 
  FiSettings, 
  FiSave, 
  FiGlobe,
  FiDollarSign,
  FiTruck,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'Ladies Garments',
    storeEmail: 'contact@ladiesgarments.com',
    storePhone: '+91 9876543210',
    storeAddress: 'Shop No. 10, Fashion Street, Mumbai, India',
    currency: 'INR',
    currencySymbol: '₹',
    freeShippingThreshold: 999,
    shippingCharge: 49,
    taxRate: 18,
    enableCOD: true,
    enableOnlinePayment: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Settings saved successfully!');
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your store configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <FiGlobe className="text-cyan-400" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">Store Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">
                <span className="flex items-center space-x-2">
                  <FiMail size={14} />
                  <span>Email</span>
                </span>
              </label>
              <input
                type="email"
                name="storeEmail"
                value={settings.storeEmail}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">
                <span className="flex items-center space-x-2">
                  <FiPhone size={14} />
                  <span>Phone</span>
                </span>
              </label>
              <input
                type="text"
                name="storePhone"
                value={settings.storePhone}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">
                <span className="flex items-center space-x-2">
                  <FiMapPin size={14} />
                  <span>Address</span>
                </span>
              </label>
              <input
                type="text"
                name="storeAddress"
                value={settings.storeAddress}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Payment & Currency */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <FiDollarSign className="text-emerald-400" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">Payment & Currency</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer"
              >
                <option value="INR" className="bg-slate-800">INR (₹)</option>
                <option value="USD" className="bg-slate-800">USD ($)</option>
                <option value="EUR" className="bg-slate-800">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="enableCOD"
                checked={settings.enableCOD}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/20 bg-slate-700"
              />
              <div>
                <span className="text-white font-medium">Cash on Delivery (COD)</span>
                <p className="text-sm text-slate-400">Allow customers to pay on delivery</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="enableOnlinePayment"
                checked={settings.enableOnlinePayment}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/20 bg-slate-700"
              />
              <div>
                <span className="text-white font-medium">Online Payment (Razorpay)</span>
                <p className="text-sm text-slate-400">Accept payments via UPI, cards, and net banking</p>
              </div>
            </label>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
              <FiTruck className="text-violet-400" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">Shipping</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Shipping Charge (₹)</label>
              <input
                type="number"
                name="shippingCharge"
                value={settings.shippingCharge}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Free Shipping Above (₹)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <p className="text-sm text-slate-500 mt-1">Set to 0 to disable free shipping</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave size={18} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
