'use client';

import { FiHeart, FiStar, FiUsers, FiAward, FiTarget, FiTrendingUp } from 'react-icons/fi';

const stats = [
  { icon: FiUsers, value: '10,000+', label: 'Happy Customers' },
  { icon: FiStar, value: '4.9/5', label: 'Customer Rating' },
  { icon: FiAward, value: '5+', label: 'Years Experience' },
  { icon: FiTrendingUp, value: '50,000+', label: 'Products Sold' },
];

const values = [
  {
    icon: FiHeart,
    title: 'Quality First',
    description: 'We source only the finest fabrics and materials, ensuring every piece meets our high standards of quality and comfort.',
  },
  {
    icon: FiTarget,
    title: 'Customer Focus',
    description: 'Your satisfaction is our priority. We listen to feedback and continuously improve to serve you better.',
  },
  {
    icon: FiAward,
    title: 'Affordable Luxury',
    description: 'Experience premium fashion without breaking the bank. We believe beautiful clothes should be accessible to everyone.',
  },
];

const team = [
  {
    name: 'Inder Kumar Pamnani',
    role: 'Founder & CEO',
    description: 'Passionate about bringing the latest fashion trends to women across India with uncompromising quality.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-black overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fadeInUp">
            <span className="inline-block px-4 py-2 bg-yellow-400/10 rounded-full text-yellow-400 text-sm font-medium mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-gradient-yellow">LadiesGarments</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              We're on a mission to make every woman feel beautiful and confident 
              with our carefully curated collection of elegant garments.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="glass-card-light rounded-2xl p-8 animate-fadeInUp animation-delay-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`text-center p-4 animate-fadeInUp animation-delay-${(index + 3) * 100}`}
                >
                  <div className="w-12 h-12 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="text-yellow-500" size={24} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp animation-delay-100">
              <span className="inline-block px-3 py-1 bg-yellow-100 rounded-full text-yellow-700 text-sm font-medium mb-4">
                Who We Are
              </span>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Crafting <span className="text-yellow-500">Elegance</span> Since 2019
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  LadiesGarments was born from a simple vision: to provide high-quality, 
                  stylish clothing that celebrates the beauty and grace of every woman.
                </p>
                <p>
                  What started as a small venture has grown into a trusted destination 
                  for thousands of women across India who seek fashion that combines 
                  tradition with contemporary trends.
                </p>
                <p>
                  We work directly with skilled artisans and manufacturers to bring you 
                  the finest fabrics and craftsmanship at prices that won't break the bank.
                </p>
              </div>
            </div>
            
            <div className="animate-fadeInUp animation-delay-300">
              <div className="relative">
                <div className="glass-card-yellow rounded-2xl p-8 hover-lift">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/30 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-6xl mb-4">👗</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Our Mission</h3>
                    <p className="text-gray-600">
                      To empower women through fashion by providing beautiful, 
                      high-quality garments that make them feel confident and elegant 
                      in their everyday lives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fadeInUp">
            <span className="inline-block px-3 py-1 bg-yellow-100 rounded-full text-yellow-700 text-sm font-medium mb-4">
              What We Stand For
            </span>
            <h2 className="text-3xl font-bold text-gray-800">
              Our <span className="text-yellow-500">Values</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`glass-card-light rounded-2xl p-8 hover-lift transition-smooth animate-fadeInUp animation-delay-${(index + 1) * 200}`}
              >
                <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center mb-6 glow-yellow">
                  <value.icon className="text-black" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fadeInUp">
            <span className="inline-block px-3 py-1 bg-yellow-100 rounded-full text-yellow-700 text-sm font-medium mb-4">
              Meet The Team
            </span>
            <h2 className="text-3xl font-bold text-gray-800">
              The <span className="text-yellow-500">Visionary</span> Behind
            </h2>
          </div>
          
          <div className="max-w-md mx-auto">
            {team.map((member, index) => (
              <div 
                key={index}
                className="glass-card-yellow rounded-2xl p-8 text-center hover-lift transition-smooth animate-fadeInUp animation-delay-200"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 glow-yellow">
                  <span className="text-4xl">👨‍💼</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-yellow-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="glass-card-dark rounded-2xl p-12 text-center animate-fadeInUp">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to <span className="text-gradient-yellow">Explore?</span>
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover our exquisite collection of garments designed to make you look and feel your best.
            </p>
            <a 
              href="/products" 
              className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition-smooth hover:scale-105 glow-yellow"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
