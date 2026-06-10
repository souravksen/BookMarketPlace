import { Link } from 'react-router-dom';
import { BookOpen, Globe, AtSign, Heart, Mail } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark-950 border-t border-dark-800 mt-auto">
      <div className="section-max-width page-padding py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="font-bold text-dark-100">BookMarket</span>
            </Link>
            <p className="text-sm text-dark-500 leading-relaxed">
              India's premier marketplace for buying and selling books — new, used, and rare.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[AtSign, Globe, Heart, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg text-dark-500 hover:text-dark-200 hover:bg-dark-800 transition-colors" aria-label="Social link">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Marketplace', links: [
                { to: '/', label: 'Browse Books' },
                { to: '/cart', label: 'My Cart' },
                { to: '/orders', label: 'My Orders' },
              ]
            },
            {
              title: 'Sell', links: [
                { to: '/register', label: 'Become a Seller' },
                { to: '/seller/dashboard', label: 'Seller Dashboard' },
                { to: '/', label: 'Seller Guidelines' },
              ]
            },
            {
              title: 'Support', links: [
                { to: '/', label: 'Help Center' },
                { to: '/', label: 'Contact Us' },
                { to: '/', label: 'Privacy Policy' },
                { to: '/', label: 'Terms of Service' },
              ]
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-dark-200 mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-dark-500 hover:text-dark-200 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-dark-600">
          <p>&copy; {year} BookMarket. All rights reserved.</p>
          <p>Made with ❤️ for book lovers across India</p>
        </div>
      </div>
    </footer>
  );
}
