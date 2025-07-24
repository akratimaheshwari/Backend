import React from 'react';
import { Package } from 'lucide-react';
const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">RentKart</h1>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Rentals</a>
                            <a href="#" className="text-blue-600 font-medium">About</a>
                            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-gray-600 to-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">About RentKart</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                        Revolutionizing the way you rent, share, and discover amazing products in your community
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <p className="text-lg text-gray-600 mb-4">
                                In a world where people often buy what they rarely use, RentKart was founded to challenge traditional ownership. What if instead of buying something new, you could just rent it from someone nearby? That simple question led to the creation of RentKart — a platform that makes it easy to rent what you need, when you need it.

                            </p>
                            <p className="text-lg text-gray-600 mb-6">
                                Today, we've grown into a thriving community marketplace that connects people who
                                have items to share with those who need them, creating a more sustainable and
                                economical way of living.
                            </p>
                            
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Innovation Driven</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Mission & Vision</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                            <p className="text-gray-600">
                                To create a sustainable sharing economy where communities thrive through resource
                                sharing, reducing waste, and making quality products accessible to everyone.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                            <p className="text-gray-600">
                                To be the world's leading platform for peer-to-peer rentals, fostering a global
                                community where sharing is the new buying, and sustainability is the norm.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
                            <p className="text-gray-600">Building strong, trusted communities where neighbors help neighbors</p>
                        </div>
                        <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
                            <p className="text-gray-600">Promoting environmental responsibility through sharing and reuse</p>
                        </div>
                        <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-700 transition-colors">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Safety</h3>
                            <p className="text-gray-600">Ensuring secure, reliable transactions with verified users</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
      <p className="text-lg text-gray-600 mt-4">The passionate people behind RentKart</p>
    </div>

    {/* 👇 Updated grid to 4 columns on medium screens and up */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {/* Member 1 */}
      <div className="text-center group">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
          <span className="text-white text-2xl font-bold">AM</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Akrati Maheshwari</h3>
        <p className="text-blue-600 mb-2">Full Stack Developer</p>
        <p className="text-gray-600">Leads the backend and frontend of RentKart, ensuring seamless user experience and smooth integration.</p>
      </div>

      {/* Member 2 */}
      <div className="text-center group">
        <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
          <span className="text-white text-2xl font-bold">HT</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Harshita Tyagi</h3>
        <p className="text-blue-600 mb-2">UI/UX Designer</p>
        <p className="text-gray-600">Designs intuitive interfaces to make RentKart smooth and visually appealing across all devices.</p>
      </div>

      {/* Member 3 */}
      <div className="text-center group">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
          <span className="text-white text-2xl font-bold">LS</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Laxita Samantani</h3>
        <p className="text-blue-600 mb-2">Business Strategist</p>
        <p className="text-gray-600">Creates growth plans and strategies to expand RentKart’s reach and improve customer engagement.</p>
      </div>

      {/* Member 4 */}
      <div className="text-center group">
        <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
          <span className="text-white text-2xl font-bold">LR</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Lalkesh Rajput</h3>
        <p className="text-blue-600 mb-2">Product Manager</p>
        <p className="text-gray-600">Manages features, tracks performance, and ensures RentKart delivers what users need most.</p>
      </div>
    </div>
  </div>
</section>


            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
                    <p className="text-xl mb-8 opacity-90">Start renting, sharing, and saving today</p>
                    <div className="space-x-4">
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Get Started
                        </button>
                        <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}

        </div>
    );
};

export default AboutUs;