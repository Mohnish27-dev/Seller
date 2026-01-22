'use client';

import { FiFileText, FiCheckSquare, FiAlertTriangle, FiShoppingBag } from 'react-icons/fi';

const sections = [
  {
    title: 'General Terms',
    items: [
      'By using our website, you agree to these terms and conditions.',
      'You must be at least 18 years old to make purchases.',
      'We reserve the right to modify these terms at any time.',
      'Continued use of the website constitutes acceptance of changes.',
    ],
  },
  {
    title: 'Account & Registration',
    items: [
      'You are responsible for maintaining account confidentiality.',
      'Provide accurate and complete registration information.',
      'Notify us immediately of any unauthorized account use.',
      'We may suspend accounts that violate our policies.',
    ],
  },
  {
    title: 'Orders & Payments',
    items: [
      'All prices are listed in INR and include applicable taxes.',
      'We reserve the right to refuse or cancel orders.',
      'Payment must be made in full before order processing.',
      'Order confirmation email serves as acceptance of order.',
    ],
  },
  {
    title: 'Product Information',
    items: [
      'We strive for accurate product descriptions and images.',
      'Colors may vary slightly due to monitor settings.',
      'Product availability is subject to change without notice.',
      'We reserve the right to limit quantities per order.',
    ],
  },
  {
    title: 'Intellectual Property',
    items: [
      'All content on this website is our intellectual property.',
      'Unauthorized use of content is strictly prohibited.',
      'Trademarks and logos are protected by applicable laws.',
      'You may not reproduce content without written permission.',
    ],
  },
  {
    title: 'Limitation of Liability',
    items: [
      'We are not liable for indirect or consequential damages.',
      'Our liability is limited to the purchase price of products.',
      'We are not responsible for third-party website content.',
      'Force majeure events may affect order fulfillment.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="relative py-20 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fadeInUp">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 glow-yellow">
              <FiFileText className="text-black" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Terms & <span className="text-gradient-yellow">Conditions</span>
            </h1>
            <p className="text-xl text-gray-300">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 animate-fadeInUp animation-delay-200">
            <div className="glass-card-light rounded-2xl p-6 hover-lift text-center">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 glow-yellow">
                <FiCheckSquare className="text-black" size={28} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Accept to Use</h3>
              <p className="text-gray-600 text-sm">Using our site means you agree to these terms</p>
            </div>
            <div className="glass-card-light rounded-2xl p-6 hover-lift text-center">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 glow-yellow">
                <FiShoppingBag className="text-black" size={28} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Shop Safely</h3>
              <p className="text-gray-600 text-sm">Protected transactions and fair policies</p>
            </div>
            <div className="glass-card-light rounded-2xl p-6 hover-lift text-center">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 glow-yellow">
                <FiAlertTriangle className="text-black" size={28} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Know Your Rights</h3>
              <p className="text-gray-600 text-sm">Understand your rights and responsibilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {sections.map((s, i) => (
              <div key={i} className="glass-card-light rounded-2xl p-8 animate-fadeInUp" style={{ animationDelay: `${i * 50}ms` }}>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  {s.title}
                </h2>
                <ul className="space-y-3">
                  {s.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card-yellow rounded-2xl p-8 text-center animate-fadeInUp">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Questions About Terms?</h3>
              <p className="text-gray-600 mb-6">Contact us for clarification on any terms.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+918317052176" className="px-6 py-3 bg-black text-yellow-400 rounded-xl font-medium hover:bg-gray-900 transition-smooth">
                  📞 +91 8317052176
                </a>
                <a href="mailto:inderkumarpamnani@gmail.com" className="px-6 py-3 bg-yellow-400 text-black rounded-xl font-medium hover:bg-yellow-300 transition-smooth">
                  ✉️ Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="text-center text-gray-400 text-sm pb-12">Last updated: January 2026</p>
    </div>
  );
}
