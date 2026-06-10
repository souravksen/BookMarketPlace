import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, BookOpen, User, LogOut, LayoutDashboard, Package, ChevronDown, Menu, X, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getInitials, debounce } from '../../utils/helpers';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleSearch = debounce((q) => {
    if (q.trim()) navigate(`/?search=${encodeURIComponent(q.trim())}`);
  }, 400);

  const handleLogout = () => {
    logout();
    setLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-lg border-b border-dark-800">
        <div className="section-max-width page-padding">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg text-gradient hidden sm:block">BookMarket</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-2 sm:mx-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="search"
                  placeholder="Search books, authors..."
                  className="input-field pl-9 py-2 text-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  aria-label="Search books"
                />
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {/* Nearby */}
              <Link
                to="/nearby"
                className="flex items-center gap-1.5 p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-800 rounded-xl transition-all"
                aria-label="Nearby Books"
              >
                <MapPin size={20} />
                <span className="hidden lg:block text-sm font-medium">Nearby</span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-800 rounded-xl transition-all"
                aria-label={`Cart with ${totalItems} items`}
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((p) => !p)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-dark-800 transition-colors"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                      {getInitials(user?.name)}
                    </div>
                    <span className="text-sm font-medium text-dark-200 max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`text-dark-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 card-glass shadow-2xl animate-slide-down py-1.5">
                      <div className="px-4 py-2 border-b border-dark-800 mb-1">
                        <p className="text-sm font-semibold text-dark-100 truncate">{user?.name}</p>
                        <p className="text-xs text-dark-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-800 transition-colors">
                        <Package size={15} /> My Orders
                      </Link>
                      {user?.role === 'SELLER' && (
                        <Link to="/seller/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-800 transition-colors">
                          <LayoutDashboard size={15} /> Seller Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { setDropdownOpen(false); setLogoutModalOpen(true); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-dark-800 transition-colors"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile: Cart + Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <Link to="/nearby" className="p-2 text-dark-400 hover:text-dark-100" aria-label="Nearby Books">
                <MapPin size={20} />
              </Link>
              <Link to="/cart" className="relative p-2 text-dark-400 hover:text-dark-100" aria-label="Cart">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen((p) => !p)}
                className="p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-800 rounded-xl"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-dark-800 py-3 space-y-1 animate-slide-down">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-semibold text-dark-100">{user?.name}</p>
                    <p className="text-xs text-dark-500">{user?.email}</p>
                  </div>
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-dark-300 hover:bg-dark-800 rounded-lg mx-2">
                    <Package size={16}/> My Orders
                  </Link>
                  {user?.role === 'SELLER' && (
                    <Link to="/seller/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-dark-300 hover:bg-dark-800 rounded-lg mx-2">
                      <LayoutDashboard size={16}/> Seller Dashboard
                    </Link>
                  )}
                  <button onClick={() => { setMobileMenuOpen(false); setLogoutModalOpen(true); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-dark-800 rounded-lg mx-2">
                    <LogOut size={16}/> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4 pb-2">
                  <Link to="/login" className="flex-1"><Button variant="secondary" className="w-full">Login</Button></Link>
                  <Link to="/register" className="flex-1"><Button className="w-full">Register</Button></Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Logout"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogoutModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </>
        }
      >
        <p className="text-dark-300 text-sm">Are you sure you want to log out of your account?</p>
      </Modal>
    </>
  );
}
