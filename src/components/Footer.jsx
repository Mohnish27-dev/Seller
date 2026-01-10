import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className="text-primary-400">Ladies</span>Garments
            </h3>
            <p className="text-sm mb-4">
              Your one-stop destination for beautiful and elegant ladies garments. 
              Quality fabrics, trendy designs, and affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-500 transition">
                <FiInstagram size={24} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition">
                <FiFacebook size={24} />
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition">
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="hover:text-primary-400 transition">All Products</Link></li>
              <li><Link href="/products?category=salwar" className="hover:text-primary-400 transition">Salwar</Link></li>
              <li><Link href="/products?category=suit" className="hover:text-primary-400 transition">Suits</Link></li>
              <li><Link href="/products?category=kurti" className="hover:text-primary-400 transition">Kurti</Link></li>
              <li><Link href="/products?category=gown" className="hover:text-primary-400 transition">Gown</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/track-order" className="hover:text-primary-400 transition">Track Order</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-primary-400 transition">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-primary-400 transition">Return Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-400 transition">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FiPhone className="text-primary-400" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="text-primary-400" />
                <span>support@ladiesgarments.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiMapPin className="text-primary-400 mt-1" />
                <span>123 Fashion Street,<br />New Delhi, India 110001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} LadiesGarments. All rights reserved.</p>
          <p className="mt-2 text-gray-500">
            Made with ❤️ for beautiful women
          </p>
        </div>
      </div>
    </footer>
  );
}
