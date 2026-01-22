'use client';

import { FiShield, FiLock, FiEye, FiDatabase, FiUserCheck, FiMail } from 'react-icons/fi';

const highlights = [
  { icon: FiShield, title: 'Data Protection', description: 'Industry-standard security measures' },
  { icon: FiLock, title: 'Secure Payments', description: 'Encrypted transactions' },
  { icon: FiEye, title: 'Transparency', description: 'Clear data practices' },
];

const sections = [
  {
    title: 'Information We Collect',
    items: [
      'Name, email, phone number',
      'Shipping and billing addresses',
      'Payment info (processed securely)',
      'Order history and preferences',
      'IP address and browser type',
      'Pages visited on our website',
    ],
  },
  {
    title: 'How We Use Your Information',
    items: [
      'Process and fulfill your orders',
      'Communicate order updates',
      'Provide customer support',
      'Personalize shopping experience',
      'Send promotional offers (with consent)',
      'Prevent fraud and enhance security',
    ],
  },
  {
    title: 'Information Sharing',
    items: [
      'Shipping partners for delivery',
      'Payment processors',
      'Analytics providers',
      'Law enforcement when required',
      'We never sell your personal data',
    ],
  },
  {
    title: 'Your Rights',
    items: [
      'Access your personal information',
      'Request correction of data',
      'Request deletion of data',
      'Opt-out of marketing emails',
      'Withdraw consent anytime',
    ],
  },
  {
    title: 'Data Security',
    items: [
      'SSL encryption for all data',
      'Secure payment gateway (Razorpay)',
      'Regular security audits',
      'Limited access to personal data',
    ],
  },
  {
    title: 'Cookies',
    items: [
      'Essential cookies for functionality',
      'Analytics cookies for improvements',
      'Preference cookies for settings',
      'Control cookies via browser settings',
    ],
  },
];

export default function PrivacyPolicyPage() {
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
              <FiShield className="text-black" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Privacy <span className="text-gradient-yellow">Policy</span>
            </h1>
            <p className="text-xl text-gray-300">
              Your privacy matters. Learn how we protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 animate-fadeInUp animation-delay-200">
            {highlights.map((h, i) => (
              <div key={i} className="glass-card-light rounded-2xl p-6 hover-lift text-center">
                <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 glow-yellow">
                  <h.icon className="text-black" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{h.title}</h3>
                <p className="text-gray-600">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {sections.map((s, i) => (
              <div key={i} className="glass-card-light rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: `${i * 50}ms` }}>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black text-sm font-bold">{i + 1}</span>
                  {s.title}
                </h2>
                <ul className="space-y-2">
                  {s.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2"></span>
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
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 glow-yellow">
                <FiMail className="text-black" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Privacy Questions?</h3>
              <p className="text-gray-600 mb-6">Contact us for any privacy-related queries.</p>
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
