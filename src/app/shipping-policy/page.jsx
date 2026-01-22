'use client';

import { FiTruck, FiClock, FiMapPin, FiPackage, FiDollarSign, FiAlertCircle } from 'react-icons/fi';

const shippingInfo = [
  {
    icon: FiTruck,
    title: 'Standard Shipping',
    description: 'Delivery within 5-7 business days',
    details: 'Free on orders above ₹999',
  },
  {
    icon: FiClock,
    title: 'Express Shipping',
    description: 'Delivery within 2-3 business days',
    details: 'Additional charges apply',
  },
  {
    icon: FiMapPin,
    title: 'Pan India Delivery',
    description: 'We deliver across all states',
    details: 'Including remote areas',
  },
];

const policies = [
  {
    title: 'Order Processing',
    content: [
      'Orders are processed within 1-2 business days after payment confirmation.',
      'You will receive an email confirmation once your order is dispatched.',
      'Orders placed on weekends or holidays will be processed on the next business day.',
    ],
  },
  {
    title: 'Shipping Charges',
    content: [
      'Standard Shipping: FREE on orders above ₹999, ₹49 for orders below ₹999.',
      'Express Shipping: ₹99 flat rate across India.',
      'Cash on Delivery (COD): Additional ₹49 handling charges.',
    ],
  },
  {
    title: 'Delivery Timeline',
    content: [
      'Metro Cities: 3-5 business days',
      'Tier 2 Cities: 5-7 business days',
      'Remote Areas: 7-10 business days',
      'Delivery timelines may vary during festive seasons or unforeseen circumstances.',
    ],
  },
  {
    title: 'Tracking Your Order',
    content: [
      'Once shipped, you will receive a tracking number via email and SMS.',
      'Use the tracking number on our Track Order page to monitor your delivery.',
      'Our delivery partners include BlueDart, Delhivery, and India Post.',
    ],
  },
  {
    title: 'Delivery Attempts',
    content: [
      'Our delivery partner will attempt delivery up to 3 times.',
      'If delivery fails after 3 attempts, the order will be returned to us.',
      'For re-delivery, additional shipping charges may apply.',
    ],
  },
  {
    title: 'Important Notes',
    content: [
      'Please provide accurate and complete shipping address to avoid delays.',
      'Ensure someone is available to receive the package during delivery hours.',
      'Inspect the package for any damage before accepting delivery.',
      'In case of damaged packaging, please refuse the delivery and contact us immediately.',
    ],
  },
];

export default function ShippingPolicyPage() {
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
              <FiTruck className="text-black" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Shipping <span className="text-gradient-yellow">Policy</span>
            </h1>
            <p className="text-xl text-gray-300">
              Fast and reliable delivery across India. Know everything about our shipping process.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 animate-fadeInUp animation-delay-200">
            {shippingInfo.map((info, index) => (
              <div 
                key={index}
                className="glass-card-light rounded-2xl p-6 hover-lift transition-smooth text-center"
              >
                <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 glow-yellow">
                  <info.icon className="text-black" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{info.title}</h3>
                <p className="text-gray-600 mb-2">{info.description}</p>
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                  {info.details}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {policies.map((policy, index) => (
              <div 
                key={index}
                className={`glass-card-light rounded-2xl p-8 animate-fadeInUp animation-delay-${(index + 1) * 100}`}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  {policy.title}
                </h2>
                <ul className="space-y-3">
                  {policy.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card-yellow rounded-2xl p-8 text-center animate-fadeInUp">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 glow-yellow">
                <FiAlertCircle className="text-black" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Have Questions?</h3>
              <p className="text-gray-600 mb-6">
                Our customer support team is here to help you with any shipping-related queries.
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
