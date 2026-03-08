import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import StepCards from '../components/common/StepCards';
import FlashCard from '../components/common/FlashCard';
import ProductCard from '../components/common/ProductCard';
import api from '../utils/api';

const categories = [
  { name: 'Electronics', icon: '💻', color: 'from-blue-400 to-blue-600', count: '500+' },
  { name: 'Clothing', icon: '👕', color: 'from-pink-400 to-rose-600', count: '1200+' },
  { name: 'Food & Grocery', icon: '🛒', color: 'from-green-400 to-emerald-600', count: '800+' },
  { name: 'Home & Kitchen', icon: '🏠', color: 'from-amber-400 to-orange-500', count: '300+' },
  { name: 'Books', icon: '📚', color: 'from-violet-400 to-purple-600', count: '2000+' },
  { name: 'Sports', icon: '⚽', color: 'from-teal-400 to-cyan-600', count: '400+' },
  { name: 'Beauty', icon: '💄', color: 'from-fuchsia-400 to-pink-600', count: '600+' },
  { name: 'Toys', icon: '🧸', color: 'from-yellow-400 to-amber-500', count: '250+' }
];

const features = [
  { icon: <FiTruck />, title: 'Free Delivery', desc: 'On orders above ₹999' },
  { icon: <FiShield />, title: 'Secure Payment', desc: '100% encrypted & safe' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '7-day return policy' },
  { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Always here to help' }
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [featRes, newRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products?sort=newest&limit=8')
        ]);
        setFeatured(featRes.data.data);
        setNewArrivals(newRes.data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" /> Your Local Store, Now Online
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-gray-900 leading-tight mb-6">
              Shop Smart,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Live Better</span>
            </h1>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-lg">
              Discover thousands of products from your neighborhood stores. Fast delivery, great prices, and amazing customer service.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/products')}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-sky-200 hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
                Shop Now <FiArrowRight />
              </button>
              <button onClick={() => navigate('/products?category=Electronics')}
                className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold text-lg border border-gray-200 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                Explore Deals
              </button>
            </div>
            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-8">
              <div className="text-center"><div className="text-2xl font-bold text-gray-900">10K+</div><div className="text-xs text-gray-400">Happy Customers</div></div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center"><div className="text-2xl font-bold text-gray-900">500+</div><div className="text-xs text-gray-400">Products</div></div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center"><div className="text-2xl font-bold text-gray-900">4.8★</div><div className="text-xs text-gray-400">Rating</div></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
            className="hidden lg:block relative">
            <div className="grid grid-cols-2 gap-4">
              {featured.slice(0, 4).map((p, i) => (
                <motion.div key={p._id} animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }} transition={{ duration: 3 + i, repeat: Infinity, repeatType: 'reverse' }}
                  className="glass-card overflow-hidden cursor-pointer hover:shadow-xl transition-shadow" onClick={() => navigate(`/products/${p._id}`)}>
                  <img src={p.image} alt={p.name} className="w-full h-32 object-cover" onError={e => e.target.style.display = 'none'} />
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                    <p className="text-sky-500 font-bold text-sm">₹{p.price.toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Flash Stats */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FlashCard title="Total Products" value={500} icon="📦" gradient="linear-gradient(135deg, #0ea5e9, #0369a1)" suffix="+" delay={0} />
          <FlashCard title="Orders Today" value={48} icon="🛒" gradient="linear-gradient(135deg, #f97316, #ea580c)" delay={0.1} />
          <FlashCard title="Happy Customers" value={10000} icon="😊" gradient="linear-gradient(135deg, #10b981, #059669)" suffix="+" delay={0.2} />
          <FlashCard title="Revenue (₹)" value={250000} icon="💰" gradient="linear-gradient(135deg, #8b5cf6, #6d28d9)" prefix="₹" delay={0.3} />
        </div>
      </section>

      {/* Step Cards */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <StepCards />
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-500">Find exactly what you're looking for</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={`/products?category=${cat.name}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${cat.color} text-white cursor-pointer hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-xl text-center`}>
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-semibold leading-tight">{cat.name}</span>
                <span className="text-xs opacity-75">{cat.count}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1">Featured Products</h2>
            <p className="text-gray-500">Handpicked just for you</p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-sky-500 hover:text-sky-600 font-semibold text-sm transition-colors">View All <FiArrowRight /></Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1">New Arrivals</h2>
            <p className="text-gray-500">Fresh off the shelf</p>
          </div>
          <Link to="/products?sort=newest" className="flex items-center gap-1 text-sky-500 hover:text-sky-600 font-semibold text-sm">View All <FiArrowRight /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArrivals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="glass-card p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3 p-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center text-2xl shadow-sm">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-3xl overflow-hidden relative bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 p-10 text-white text-center">
          <div className="absolute inset-0 opacity-10">
            {Array(6).fill(0).map((_, i) => <div key={i} className="absolute rounded-full bg-white" style={{ width: Math.random() * 200 + 50 + 'px', height: Math.random() * 200 + 50 + 'px', left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', transform: 'translate(-50%, -50%)' }} />)}
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Start Shopping Today!</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">Join thousands of happy customers. Get exclusive deals and free delivery on your first order.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate('/products')} className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-1">
                Browse Products
              </button>
              <button onClick={() => navigate('/register')} className="px-8 py-3 bg-white/10 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                Create Account
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;