import React from 'react';
import { Search, MessageCircle, Package, Star, Plus, DollarSign, Shield, Truck, Award, Users } from 'lucide-react';

const HowItWorks = () => {
    const renterSteps = [
        {
            icon: Search,
            title: 'Search & Browse',
            description: 'Find the perfect item for your needs from thousands of listings across multiple categories',
            color: 'bg-gradient-to-br from-blue-500 to-blue-600'
        },
        {
            icon: MessageCircle,
            title: 'Connect & Book',
            description: 'Message the owner, check availability, and book your rental dates with instant confirmation',
            color: 'bg-gradient-to-br from-green-500 to-green-600'
        },
        {
            icon: Package,
            title: 'Pick Up & Enjoy',
            description: 'Collect your item safely or get it delivered, then enjoy using it for your project',
            color: 'bg-gradient-to-br from-purple-500 to-purple-600'
        },
        {
            icon: Star,
            title: 'Return & Review',
            description: 'Return the item in good condition and leave a review to help the community',
            color: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
        }
    ];

    const ownerSteps = [
        {
            icon: Plus,
            title: 'List Your Item',
            description: 'Create a detailed listing with high-quality photos and set your rental prices',
            color: 'bg-gradient-to-br from-orange-500 to-orange-600'
        },
        {
            icon: MessageCircle,
            title: 'Get Requests',
            description: 'Receive rental requests from verified renters and manage your bookings easily',
            color: 'bg-gradient-to-br from-pink-500 to-pink-600'
        },
        {
            icon: DollarSign,
            title: 'Earn Money',
            description: 'Hand over your item securely and start earning passive income from your assets',
            color: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
        },
        {
            icon: Star,
            title: 'Build Reputation',
            description: 'Get positive reviews, build trust, and grow your rental business over time',
            color: 'bg-gradient-to-br from-red-500 to-red-600'
        }
    ];

    const benefits = [
        {
            icon: Shield,
            title: 'Secure Transactions',
            description: 'All payments are protected with our secure payment system'
        },
        {
            icon: Truck,
            title: 'Flexible Delivery',
            description: 'Choose pickup or delivery options that work for you'
        },
        {
            icon: Award,
            title: 'Quality Assured',
            description: 'All items are verified and quality-checked before listing'
        },
        {
            icon: Users,
            title: 'Trusted Community',
            description: 'Join thousands of verified renters and owners'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo + Brand */}
                        <div className="flex items-center space-x-2">
                                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                                      <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-800">RentKart</h1>
                                  </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Rentals</a>
                            <a href="/about-us" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
                            <a href="/how-it-works" className="text-blue-600 font-medium">How It Works</a>
                            {/* <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a> */}
                        </nav>
                    </div>
                </div>
            </header>


            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-gray-600 to-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">How RentKart Works</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                        Simple steps to rent what you need or earn from what you own
                    </p>
                </div>
            </section>

            {/* Main How It Works Section */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
                            Two Ways to Use RentKart
                        </h2>
                        <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
                            Whether you're looking to rent items or earn money from unused belongings,
                            we make the process simple, secure, and rewarding.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="text-center group px-2"
                            >
                                <div className="bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-gray-200">
                                    <benefit.icon className="w-5 h-5 text-gray-600" />
                                </div>
                                <h4 className="font-medium text-gray-900 text-xs mb-1">{benefit.title}</h4>
                                <p className="text-[11px] text-gray-500 leading-snug">{benefit.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Cards */}
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Renter Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                            <div className="text-center mb-6">
                                <div className="bg-gray-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">For Renters</h3>
                                <p className="text-sm text-gray-600">Access what you need, when you need it</p>
                            </div>
                            <div className="space-y-5">
                                {renterSteps.map((step, index) => (
                                    <div key={index} className="flex items-start space-x-3 group">
                                        <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
                                            <step.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h4>
                                            <p className="text-xs text-gray-600">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Owner Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                            <div className="text-center mb-6">
                                <div className="bg-gray-800 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">For Item Owners</h3>
                                <p className="text-sm text-gray-600">Earn from unused items easily</p>
                            </div>
                            <div className="space-y-5">
                                {ownerSteps.map((step, index) => (
                                    <div key={index} className="flex items-start space-x-3 group">
                                        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                                            <step.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h4>
                                            <p className="text-xs text-gray-600">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-14">
                        <div className="bg-gray-800 rounded-2xl p-6 text-white">
                            <h3 className="text-xl font-semibold mb-3">Ready to Get Started?</h3>
                            <p className="text-sm mb-4 opacity-90">Join thousands already renting and earning on RentKart</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button className="bg-white text-gray-800 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                    Start Renting
                                </button>
                                <button className="border border-white text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-gray-800 transition-colors">
                                    List Your Items
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose RentKart?</h2>
                        <p className="text-lg text-gray-600">We've built the most trusted rental platform with your needs in mind</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">100% Secure</h3>
                            <p className="text-gray-600">Every transaction is protected with bank-level security and insurance coverage</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Community</h3>
                            <p className="text-gray-600">All users are verified with ID checks and background screening for your safety</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Guaranteed</h3>
                            <p className="text-gray-600">Every item is quality-checked and comes with our satisfaction guarantee</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I know the items are in good condition?</h3>
                            <p className="text-gray-600">All items go through our quality verification process, and owners must provide detailed photos and descriptions. Plus, our review system helps you make informed decisions.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">What if something gets damaged during my rental?</h3>
                            <p className="text-gray-600">We offer comprehensive damage protection for both renters and owners. Minor wear and tear is expected, but any significant damage is covered by our insurance policy.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">How do payments work?</h3>
                            <p className="text-gray-600">Payments are processed securely through our platform. Renters pay upfront, and owners receive payment after successful completion of the rental period.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}

        </div>
    );
};

export default HowItWorks;