import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiSearch, FiUser, FiHeart, FiBell, FiLogOut, FiSettings, FiPackage, FiMenu, FiX, FiGrid } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    const handler = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?keyword=${search}`); setSearch(''); }
  };

  const notifications = user?.notifications?.filter(n => !n.read) || [];

  return (
    <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 200 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/50' : 'bg-white/70 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">L</div>
            <span className="font-display font-700 text-xl text-gray-900">Local<span className="text-sky-500">Mart</span></span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, categories..."
              className="w-full px-4 py-2.5 pl-11 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-all" />
            <FiSearch className="absolute left-3.5 top-3 text-gray-400" size={16} />
            <button type="submit" className="absolute right-2 top-1.5 bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-sky-600 transition-colors">Search</button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-sky-50 text-gray-600 hover:text-sky-500 transition-all relative">
              <FiHeart size={20} />
            </Link>

            {user && (
              <div className="relative">
                <button onClick={() => setShowNotif(!showNotif)} className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-sky-50 text-gray-600 hover:text-sky-500 transition-all relative">
                  <FiBell size={20} />
                  {notifications.length > 0 && <span className="cart-badge">{notifications.length}</span>}
                </button>
                <AnimatePresence>
                  {showNotif && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                      <div className="p-4 border-b bg-gradient-to-r from-sky-50 to-blue-50">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-400 text-sm">No new notifications</div>
                        ) : notifications.slice(0, 5).map((n, i) => (
                          <div key={i} className="p-3 border-b hover:bg-gray-50 transition-colors">
                            <p className="text-sm text-gray-700">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <Link to="/cart" className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-sky-50 text-gray-600 hover:text-sky-500 transition-all">
              <FiShoppingCart size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>

            {/* Profile */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-sky-50 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-20 truncate">{user.name?.split(' ')[0]}</span>
                </button>
                <AnimatePresence>
                  {showProfile && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 border-b">
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="p-2">
                        {isAdmin && <Link to="/admin" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-50 text-gray-700 text-sm transition-colors"><FiGrid size={16} /><span>Admin Panel</span></Link>}
                        <Link to="/orders" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-50 text-gray-700 text-sm transition-colors"><FiPackage size={16} /><span>My Orders</span></Link>
                        <Link to="/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-50 text-gray-700 text-sm transition-colors"><FiSettings size={16} /><span>Settings</span></Link>
                        <button onClick={() => { logout(); setShowProfile(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-500 text-sm transition-colors w-full"><FiLogOut size={16} /><span>Logout</span></button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg">
                <FiUser size={16} /><span className="hidden sm:block">Login</span>
              </Link>
            )}

            <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden overflow-hidden border-t border-gray-100">
              <form onSubmit={handleSearch} className="flex p-3 gap-2">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="flex-1 px-3 py-2 rounded-xl border text-sm" />
                <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-xl text-sm">Go</button>
              </form>
              <div className="pb-3 flex flex-col gap-1 px-3">
                {['/', '/products', '/cart', '/wishlist', '/orders', '/support'].map((path, i) => (
                  <Link key={i} to={path} onClick={() => setMobileMenu(false)}
                    className="px-3 py-2.5 rounded-xl hover:bg-sky-50 text-gray-700 text-sm capitalize">
                    {path === '/' ? 'Home' : path.slice(1)}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;