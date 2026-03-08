import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiCreditCard, FiTruck, FiSmartphone } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Address', 'Payment', 'Review'];

const CheckoutPage = () => {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'India' });
  const [payment, setPayment] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) { navigate('/cart'); return null; }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.fullName || !address.street || !address.city || !address.zipCode) {
      toast.error('Fill all required fields'); return;
    }
    setStep(1);
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const orderData = {
        items: items.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, quantity: i.qty })),
        shippingAddress: address, paymentMethod: payment,
        itemsPrice, shippingPrice, taxPrice, totalPrice
      };
      const { data } = await api.post('/orders', orderData);
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate(`/orders/${data.data._id}?success=true`);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to place order'); }
    finally { setPlacing(false); }
  };

  const PAYMENT_METHODS = [
    { value: 'COD', label: 'Cash on Delivery', icon: <FiTruck />, desc: 'Pay when you receive' },
    { value: 'Card', label: 'Credit/Debit Card', icon: <FiCreditCard />, desc: 'Visa, Mastercard, RuPay' },
    { value: 'UPI', label: 'UPI Payment', icon: <FiSmartphone />, desc: 'GPay, PhonePe, Paytm' },
    { value: 'NetBanking', label: 'Net Banking', icon: <FiCreditCard />, desc: 'All major banks' }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center mb-10 mt-4">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i < step ? <FiCheck /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-sky-500' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-1 mx-3 rounded-full transition-all ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 0: Address */}
          {step === 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 rounded-2xl">
              <h2 className="font-display font-bold text-xl text-gray-900 mb-6">Shipping Address</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[['fullName', 'Full Name *'], ['phone', 'Phone Number']].map(([k, l]) => (
                    <div key={k}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                      <input value={address[k]} onChange={e => setAddress({...address, [k]: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm" placeholder={l} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm" placeholder="House no, Street, Area" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[['city', 'City *'], ['state', 'State'], ['zipCode', 'PIN Code *']].map(([k, l]) => (
                    <div key={k}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                      <input value={address[k]} onChange={e => setAddress({...address, [k]: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm" placeholder={l} />
                    </div>
                  ))}
                </div>
                <button type="submit" className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-semibold transition-colors">Continue to Payment</button>
              </form>
            </motion.div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 rounded-2xl">
              <h2 className="font-display font-bold text-xl text-gray-900 mb-6">Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {PAYMENT_METHODS.map(m => (
                  <button key={m.value} onClick={() => setPayment(m.value)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${payment === m.value ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payment === m.value ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{m.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{m.label}</p>
                      <p className="text-xs text-gray-400">{m.desc}</p>
                    </div>
                    {payment === m.value && <FiCheck className="ml-auto text-sky-500" />}
                  </button>
                ))}
              </div>
              {payment !== 'COD' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm mb-4">
                  🔒 This is a demo. No actual payment will be processed.
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 py-3.5 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">Back</button>
                <button onClick={() => setStep(2)} className="flex-1 py-3.5 bg-sky-500 text-white rounded-2xl font-semibold hover:bg-sky-600 transition-colors">Review Order</button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="glass-card p-6 rounded-2xl">
                <h2 className="font-display font-bold text-xl text-gray-900 mb-4">Order Review</h2>
                {items.map(item => (
                  <div key={item._id} className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" onError={e => e.target.src='https://via.placeholder.com/60'} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold text-gray-800">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="glass-card p-5 rounded-2xl">
                <p className="text-sm text-gray-500 mb-1 font-medium">Delivery to:</p>
                <p className="font-semibold text-gray-800">{address.fullName}</p>
                <p className="text-sm text-gray-500">{address.street}, {address.city}, {address.state} {address.zipCode}</p>
                <p className="text-sm text-gray-500 mt-2">Payment: <strong>{payment}</strong></p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3.5 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">Back</button>
                <button onClick={placeOrder} disabled={placing}
                  className="flex-1 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                  {placing ? 'Placing Order...' : '🎉 Place Order'}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Price Summary */}
        <div className="glass-card p-6 h-fit rounded-2xl sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4">Price Summary</h3>
          {items.map(i => (
            <div key={i._id} className="flex justify-between text-sm text-gray-500 mb-2">
              <span className="truncate flex-1 mr-2">{i.name.slice(0, 20)}... ×{i.qty}</span>
              <span>₹{(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
            <div className="flex justify-between text-gray-500 text-sm"><span>Subtotal</span><span>₹{itemsPrice.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-500 text-sm"><span>Shipping</span><span className={shippingPrice === 0 ? 'text-green-500' : ''}>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span></div>
            <div className="flex justify-between text-gray-500 text-sm"><span>Tax</span><span>₹{taxPrice.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t"><span>Total</span><span>₹{totalPrice.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;