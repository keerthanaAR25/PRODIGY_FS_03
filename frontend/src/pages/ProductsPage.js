import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/common/ProductCard';
import api from '../utils/api';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Food & Grocery', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Automotive'];
const SORTS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Top Rated', value: 'rating' }
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page')) || 1;
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (keyword) params.append('keyword', keyword);
      if (category && category !== 'All') params.append('category', category);
      if (sort) params.append('sort', sort);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (rating) params.append('rating', rating);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.data);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [keyword, category, sort, page, minPrice, maxPrice, rating]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const applyFilters = () => { fetchProducts(); setShowFilters(false); };

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Categories</h3>
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${(category === cat || (cat === 'All' && !category)) ? 'bg-sky-500 text-white font-semibold' : 'hover:bg-sky-50 text-gray-600'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Price Range</h3>
        <div className="flex gap-2">
          <input value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min ₹" className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max ₹" className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Minimum Rating</h3>
        {[4, 3, 2, 1].map(r => (
          <button key={r} onClick={() => setRating(rating == r ? '' : r)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm mb-1 transition-all ${rating == r ? 'bg-amber-50 text-amber-700 font-semibold' : 'hover:bg-gray-50 text-gray-600'}`}>
            {'★'.repeat(r)}{'☆'.repeat(5 - r)} & up
          </button>
        ))}
      </div>

      <button onClick={applyFilters} className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition-colors">
        Apply Filters
      </button>
      <button onClick={() => { setMinPrice(''); setMaxPrice(''); setRating(''); setSearchParams({}); }}
        className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors">
        Clear All
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            {keyword ? `Results for "${keyword}"` : category !== 'All' ? category : 'All Products'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{total} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 lg:hidden">
            <FiFilter size={16} /> Filters
          </button>
          <select value={sort} onChange={e => updateParam('sort', e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="glass-card p-5 sticky top-24"><Sidebar /></div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array(12).fill(0).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">No products found</h2>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }, (_, i) => (
                    <button key={i} onClick={() => updateParam('page', i + 1)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all ${page === i + 1 ? 'bg-sky-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-sky-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 rounded-xl hover:bg-gray-100"><FiX /></button>
              </div>
              <Sidebar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;