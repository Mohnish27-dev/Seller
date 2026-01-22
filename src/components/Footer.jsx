import Link from 'next/link';
import { FiPhone, FiMail, FiInstagram, FiFacebook, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="glass-card-dark rounded-2xl p-8 mb-12 text-center animate-fadeInUp">
          <h3 className="text-2xl font-bold text-white mb-2">
            Stay <span className="text-gradient-yellow">Updated!</span>
          </h3>
          <p className="text-gray-400 mb-6">
            Subscribe to get updates on new arrivals and special offers
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 glass-card rounded-full focus-glow-yellow transition-smooth text-white placeholder-gray-400"
            />
            <button type="submit" className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-smooth hover:scale-105 flex items-center justify-center gap-2">
              <FiSend size={18} />
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="animate-fadeInUp animation-delay-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-black">G</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Ladies<span className="text-yellow-400">Garments</span>
              </h3>
            </div>
            <p className="text-sm mb-4 text-gray-400">
              Your one-stop destination for beautiful and elegant ladies garments. 
              Quality fabrics, trendy designs, and affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-yellow-400 transition-smooth hover:scale-110 hover-glow-yellow">
                <FiInstagram size={24} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-smooth hover:scale-110 hover-glow-yellow">
                <FiFacebook size={24} />
              </a>
              <a href="https://wa.me/+918317052176" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-smooth hover:scale-110 hover-glow-yellow">
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fadeInUp animation-delay-200">
            <h4 className="text-white font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="hover:text-yellow-400 transition-smooth hover:translate-x-1 inline-block">All Products</Link></li>
              <li><Link href="/about" className="hover:text-yellow-400 transition-smooth hover:translate-x-1 inline-block">About Us</Link></li>
              <li><Link href="/products?category=salwar" className="hover:text-yellow-400 transition-smooth hover:translate-x-1 inline-block">Salwar</Link></li>
              <li><Link href="/products?category=suit" className="hover:text-yellow-400 transition-smooth hover:translate-x-1 inline-block">Suits</Link></li>
              <li><Link href="/products?category=kurti" className="hover:text-yellow-400 transition-smooth hover:translate-x-1 inline-block">Kurti</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="animate-fadeInUp animation-delay-300">
            <h4 className="text-white font-bold mb-4 text-lg">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/track-order" className="hover:text-yellow-400 transition-smooth hover:translate-x-1 inline-block">Track Order</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-yellow-400 transition-smooth hover:translate-x-1 inline-block">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-yellow-400 transition-smooth hover:translate-x-1 inline-block">Return Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-yellow-400 transition-smooth hover:translate-x-1 inline-block">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-yellow-400 transition-smooth hover:translate-x-1 inline-block">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fadeInUp animation-delay-400">
            <h4 className="text-white font-bold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FiPhone className="text-yellow-400" />
                <a href="tel:+918317052176" className="hover:text-yellow-400 transition-smooth">+91 8317052176</a>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="text-yellow-400" />
                <a href="mailto:inderkumarpamnani@gmail.com" className="text-sm hover:text-yellow-400 transition-smooth">inderkumarpamnani@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} LadiesGarments. All rights reserved.</p>
          <p className="mt-2 text-gray-500">
            Made with <span className="text-yellow-400">❤️</span> for beautiful women
          </p>
        </div>
      </div>
    </footer>
  );
}
