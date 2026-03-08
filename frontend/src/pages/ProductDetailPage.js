import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiHeart, FiArrowLeft, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ProductCard from '../components/common/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [related, setRelated] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
        if (data.data.category) {
          const rel = await api.get(`/products?category=${data.data.category}&limit=4`);
          setRelated(rel.data.data.filter(p => p._id !== id));
        }
      } catch { navigate('/404'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`${qty} × ${product.name} added to cart!`);
  };

  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  const submitReview = async () => {
    if (!user) { toast.error('Login to write a review'); return; }
    if (!reviewText.trim()) { toast.error('Write a review first'); return; }
    setSubmittingReview(true);
    try {
      await api.post(`/reviews/${id}`, { rating: reviewRating, comment: reviewText });
      toast.success('Review submitted! ⭐');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
      setReviewText('');
    } catch (e) { toast.error(e.response?.data?.message || 'Review failed'); }
    finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" style={{ width: `${80 - i * 10}%` }} />)}</div>
      </div>
    </div>
  );

  if (!product) return null;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating));
  const images = [product.image, ...(product.images || [])].filter(Boolean);
  const discount = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <FiArrowLeft /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card overflow-hidden rounded-2xl mb-3 aspect-square">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-contain p-4" onError={e => e.target.src = 'https://via.placeholder.com/500'} />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.slice(0, 4).map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-sky-500' : 'border-gray-200'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <div className="text-sm text-sky-500 font-semibold mb-1">{product.category}</div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">{stars.map((f, i) => <FiStar key={i} size={16} className={f ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />)}</div>
                <span className="font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({product.numReviews} reviews)</span>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-4xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              {discount > 0 && <>
                <span className="text-xl text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
                <span className="bg-red-50 text-red-500 text-sm font-bold px-2 py-1 rounded-lg">{discount}% OFF</span>
              </>}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            <div className="glass-card p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className={`font-semibold text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center font-bold transition-colors">-</button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center font-bold transition-colors">+</button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-sky-500 text-sky-500 hover:bg-sky-50 rounded-2xl font-semibold transition-all disabled:opacity-50">
                <FiShoppingCart /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0}
                className="flex-1 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50">
                Buy Now
              </button>
              <button className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-2xl hover:border-red-300 hover:text-red-400 transition-all">
                <FiHeart />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[{ icon: <FiTruck />, text: 'Free delivery over ₹999' }, { icon: <FiShield />, text: 'Secure checkout' }, { icon: <FiRefreshCw />, text: '7-day returns' }].map((f, i) => (
                <div key={i} className="glass-card p-3 rounded-xl flex flex-col items-center gap-1 text-center">
                  <div className="text-sky-500">{f.icon}</div>
                  <span className="text-xs text-gray-500">{f.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <div className="glass-card p-6 rounded-2xl mb-16">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-6">Customer Reviews</h2>
          {user && (
            <div className="mb-8 p-5 bg-sky-50 rounded-2xl">
              <h3 className="font-semibold text-gray-800 mb-3">Write a Review</h3>
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map(r => (
                  <button key={r} onClick={() => setReviewRating(r)}>
                    <FiStar size={24} className={r <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
              <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3} placeholder="Share your experience with this product..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm resize-none bg-white" />
              <button onClick={submitReview} disabled={submittingReview}
                className="mt-3 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          )}
          {product.reviews?.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {product.reviews?.map((r, i) => (
                <motion.div key={r._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {r.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{r.name || 'User'}</p>
                        <div className="flex gap-0.5">{Array(5).fill(0).map((_, j) => <FiStar key={j} size={12} className={j < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{r.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;