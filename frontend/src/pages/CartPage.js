import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiArrowLeft, FiShoppingBag, FiTruck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { items, removeFromCart, updateQty, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-display font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Discover amazing products and start shopping!</p>
        <Link to="/products" className="px-8 py-3 bg-sky-500 text-white rounded-2xl font-semibold hover:bg-sky-600 transition-colors">
          Start Shopping
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 mt-4 transition-colors">
        <FiArrowLeft /> Continue Shopping
      </button>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-8">Shopping Cart <span className="text-sky-500">({items.length})</span></h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map(item => (
              <motion.div key={item._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                className="glass-card p-4 flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-gray-100" onError={e => e.target.src = 'https://via.placeholder.com/100'} />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item._id}`} className="font-semibold text-gray-800 hover:text-sky-600 transition-colors line-clamp-2">{item.name}</Link>
                  <p className="text-sky-500 font-bold text-lg mt-1">₹{item.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                      <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center font-bold transition-colors">-</button>
                      <span className="w-8 text-center font-semibold">{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center font-bold transition-colors">+</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-800">₹{(item.price * item.qty).toLocaleString()}</span>
                      <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-500 transition-colors p-1"><FiTrash2 /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h2 className="font-display font-bold text-gray-900 text-lg mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{itemsPrice.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1"><FiTruck size={14} /> Shipping</span>
                <span className={shippingPrice === 0 ? 'text-green-500 font-semibold' : ''}>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
              </div>
              <div className="flex justify-between text-gray-600"><span>Tax (10%)</span><span>₹{taxPrice.toLocaleString()}</span></div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span><span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            {shippingPrice > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-700">
                Add ₹{(999 - itemsPrice).toLocaleString()} more for FREE shipping!
              </div>
            )}
            <button onClick={() => user ? navigate('/checkout') : navigate('/login?redirect=/checkout')}
              className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-semibold text-lg hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <FiShoppingBag /> Proceed to Checkout
            </button>
            {!user && <p className="text-xs text-center text-gray-400 mt-2">You'll need to login to checkout</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;