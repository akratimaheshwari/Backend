import { Package, Mail, Phone,Facebook,Twitter,
  Instagram, } from 'lucide-react';

 const Footer = () => {
    return  <footer className="bg-gray-700 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">RentKart</h3>
          </div>
          <p className="text-gray-400 mb-6 max-w-md">
            Why buy when you can rent? Discover, lend, and earn with RentKart — your smart rental marketplace.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/items" className="text-gray-400 hover:text-white transition-colors">Browse Items</a></li>
            <li><a href="/about-us" className="text-gray-400 hover:text-white transition-colors">About us</a></li>
            <li><a href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
            <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            
          </ul>
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-t border-gray-800 mt-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span>suppor@rentkart.com</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 RentKart. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
 };
 
export default Footer;