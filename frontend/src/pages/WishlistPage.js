import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get('/users/wishlist').then(({ data }) => setWishlist(data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      await api.post(`/products/${productId}/wishlist`);
      setWishlist(wishlist.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mt-4 mb-8">
        <FiHeart className="text-red-400" size={24} />
        <h1 className="text-2xl font-display font-bold text-gray-900">My Wishlist</h1>
        <span className="text-gray-400">({wishlist.length} items)</span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-6">Save your favorite products here</p>
          <Link to="/products" className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product, i) => (
            <motion.div key={product._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl overflow-hidden group">
              <Link to={`/products/${product._id}`} className="block relative">
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => e.target.src = 'https://via.placeholder.com/200'} />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/products/${product._id}`} className="font-semibold text-gray-800 text-sm line-clamp-2 hover:text-sky-600 transition-colors">{product.name}</Link>
                <p className="text-sky-500 font-bold mt-1">₹{product.price?.toLocaleString()}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => addToCart(product)} className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold transition-colors">Add to Cart</button>
                  <button onClick={() => removeFromWishlist(product._id)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><FiTrash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;