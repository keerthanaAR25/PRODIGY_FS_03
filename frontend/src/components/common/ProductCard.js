import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product, index = 0 }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to wishlist'); return; }
    try {
      await api.post(`/products/${product._id}/wishlist`);
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating));

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.4 }}
      className="product-card glass-card overflow-hidden group">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative overflow-hidden h-52 bg-gradient-to-br from-gray-50 to-gray-100">
          {!imgError ? (
            <img src={product.image} alt={product.name} onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">🛍️</div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">{discount}% OFF</span>
          )}
          {product.isNew && (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">NEW</span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">Out of Stock</span>
            </div>
          )}
          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button onClick={toggleWishlist}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'}`}>
              <FiHeart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <Link to={`/products/${product._id}`} className="w-10 h-10 rounded-full bg-white text-gray-700 hover:bg-sky-500 hover:text-white flex items-center justify-center shadow-lg transition-all">
              <FiEye size={16} />
            </Link>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="text-xs text-sky-500 font-semibold mb-1">{product.category}</div>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 hover:text-sky-600 transition-colors leading-snug">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {stars.map((filled, i) => <FiStar key={i} size={12} className={filled ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />)}
          <span className="text-xs text-gray-400">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <button onClick={() => product.stock > 0 && addToCart(product)} disabled={product.stock === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white rounded-xl text-xs font-semibold transition-all shadow-md hover:shadow-lg active:scale-95">
            <FiShoppingCart size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;