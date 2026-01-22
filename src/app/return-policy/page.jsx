'use client';

import { FiRefreshCw, FiCheckCircle, FiXCircle, FiClock, FiDollarSign, FiHelpCircle } from 'react-icons/fi';

const returnHighlights = [
  {
    icon: FiClock,
    title: '7 Days Return',
    description: 'Easy returns within 7 days of delivery',
  },
  {
    icon: FiDollarSign,
    title: 'Full Refund',
    description: 'Get 100% refund on eligible returns',
  },
  {
    icon: FiRefreshCw,
    title: 'Free Exchange',
    description: 'Exchange for different size or color',
  },
];

const eligibleItems = [
  'Products with manufacturing defects',
  'Wrong size or color received',
  'Products damaged during shipping',
  'Products significantly different from description',
  'Unused products with original tags intact',
];

const nonEligibleItems = [
  'Products without original tags and packaging',
  'Products that have been worn, washed, or altered',
  'Products marked as "Final Sale" or "Non-Returnable"',
  'Intimate wear, lingerie, and swimwear',
  'Products returned after 7 days of delivery',
  'Products with customer-caused damage',
];

const returnSteps = [
  {
    step: 1,
    title: 'Initiate Return',
    description: 'Contact us via WhatsApp or email with your order ID and reason for return.',
  },
  {
    step: 2,
    title: 'Get Approval',
    description: 'Our team will review your request and provide return instructions within 24 hours.',
  },
  {
    step: 3,
    title: 'Pack & Ship',
    description: 'Pack the item securely with original tags and ship using our prepaid label.',
  },
  {
    step: 4,
    title: 'Receive Refund',
    description: 'Once received and inspected, refund will be processed within 5-7 business days.',
  },
];

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-black overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fadeInUp">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 glow-yellow">
              <FiRefreshCw className="text-black" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Return & Refund <span className="text-gradient-yellow">Policy</span>
            </h1>
            <p className="text-xl text-gray-300">
              Shop with confidence. We make returns easy and hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 animate-fadeInUp animation-delay-200">
            {returnHighlights.map((highlight, index) => (
              <div 
                key={index}
                className="glass-card-light rounded-2xl p-6 hover-lift transition-smooth text-center"
              >
                <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 glow-yellow">
                  <highlight.icon className="text-black" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 animate-fadeInUp">
              How to <span className="text-yellow-500">Return</span>
            </h2>
            
            <div className="grid md:grid-cols-4 gap-4">
              {returnSteps.map((item, index) => (
                <div key={index} className="relative animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="glass-card-light rounded-2xl p-6 text-center h-full hover-lift">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold glow-yellow">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  {index < returnSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-yellow-400"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eligible / Non-Eligible */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Eligible */}
            <div className="glass-card-light rounded-2xl p-8 animate-fadeInUp animation-delay-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {eligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheckCircle className="text-green-600" size={12} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Non-Eligible */}
            <div className="glass-card-light rounded-2xl p-8 animate-fadeInUp animation-delay-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FiXCircle className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Not Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {nonEligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiXCircle className="text-red-600" size={12} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card-yellow rounded-2xl p-8 animate-fadeInUp">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FiDollarSign className="text-yellow-600" size={24} />
                Refund Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Refund Timeline</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• UPI/Net Banking: 3-5 business days</li>
                    <li>• Credit/Debit Card: 5-7 business days</li>
                    <li>• Wallet: Instant to 24 hours</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Refund Mode</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Refund will be credited to original payment method</li>
                    <li>• COD orders will be refunded via bank transfer</li>
                    <li>• You can also opt for store credit</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card-light rounded-2xl p-8 text-center animate-fadeInUp">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 glow-yellow">
                <FiHelpCircle className="text-black" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help with Returns?</h3>
              <p className="text-gray-600 mb-6">
                Our team is ready to assist you with any return or refund queries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+918317052176"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-yellow-400 rounded-xl font-medium hover:bg-gray-900 transition-smooth"
                >
                  📞 +91 8317052176
                </a>
                <a 
                  href="mailto:inderkumarpamnani@gmail.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-xl font-medium hover:bg-yellow-300 transition-smooth"
                >
                  ✉️ Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <div className="container mx-auto px-4 pb-12">
        <p className="text-center text-gray-400 text-sm">
          Last updated: January 2026
        </p>
      </div>
    </div>
  );
}
