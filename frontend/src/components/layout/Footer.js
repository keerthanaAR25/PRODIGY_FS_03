import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">L</div>
              <span className="font-display font-bold text-xl text-white">Local<span className="text-sky-400">Mart</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">Your neighborhood store, now online. Quality products, fast delivery, and amazing customer service.</p>
            <div className="flex gap-3">
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-sky-600 flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['Home', '/'], ['Products', '/products'], ['Cart', '/cart'], ['My Orders', '/orders'], ['Support', '/support']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-gray-400 hover:text-sky-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2.5">
              {['Electronics', 'Clothing', 'Food & Grocery', 'Home & Kitchen', 'Books', 'Sports'].map(c => (
                <li key={c}>
                  <Link to={`/products?category=${c}`} className="text-sm text-gray-400 hover:text-sky-400 transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3">
              {[
                [FiMapPin, '123 MG Road, Chennai, TN 600001'],
                [FiPhone, '+91 98765 43210'],
                [FiMail, 'support@localmart.com']
              ].map(([Icon, text], i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <Icon size={14} className="text-sky-400 mt-0.5 flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Customer Support Hours</p>
              <p className="text-sm text-white font-medium">Mon–Sat: 9AM – 6PM IST</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2024 LocalMart. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(l => (
              <a key={l} href="#" className="hover:text-sky-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
