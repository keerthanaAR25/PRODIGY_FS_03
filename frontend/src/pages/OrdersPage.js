import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiTruck, FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';
import api from '../utils/api';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const STATUS_ICONS = { Pending: <FiClock />, Processing: <FiPackage />, Shipped: <FiTruck />, Delivered: <FiCheck />, Cancelled: <FiX /> };
const STATUS_COLORS = { Pending: 'badge-pending', Processing: 'badge-processing', Shipped: 'badge-shipped', Delivered: 'badge-delivered', Cancelled: 'badge-cancelled' };

// ===== ORDER LIST =====
export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-display font-bold text-gray-900 mt-4 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <Link to="/products" className="text-sky-500 hover:text-sky-600 font-semibold">Start Shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-5 rounded-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="font-bold text-gray-900">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  <span className="font-bold text-gray-800">₹{order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-3 mb-4 overflow-x-auto pb-1">
                {order.items.slice(0, 4).map(item => (
                  <img key={item._id} src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100" onError={e => e.target.src = 'https://via.placeholder.com/60'} />
                ))}
                {order.items.length > 4 && <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">+{order.items.length - 4}</div>}
              </div>
              <Link to={`/orders/${order._id}`} className="text-sky-500 hover:text-sky-600 text-sm font-semibold flex items-center gap-1">View Details →</Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== ORDER DETAIL =====
export const OrderDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const isSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return null;

  const currentStepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {isSuccess && (
        <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-6 mt-4 p-5 bg-green-50 border-2 border-green-200 rounded-2xl text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="font-bold text-green-700 text-lg">Order Placed Successfully!</h2>
          <p className="text-green-600 text-sm">We'll process your order shortly. You'll receive updates.</p>
        </motion.div>
      )}

      <Link to="/orders" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 mt-4 transition-colors">
        <FiArrowLeft /> My Orders
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Status Tracker */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-gray-900">Order #{order.orderNumber}</h2>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>{order.status}</span>
            </div>
            {order.status !== 'Cancelled' && (
              <div className="relative">
                <div className="flex justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
                    <div className="h-full bg-sky-500 transition-all" style={{ width: `${Math.max(0, (currentStepIdx / (STATUS_STEPS.length - 1)) * 100)}%` }} />
                  </div>
                  {STATUS_STEPS.map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-2 z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${i <= currentStepIdx ? 'bg-sky-500 text-white shadow-md shadow-sky-200' : 'bg-gray-200 text-gray-400'}`}>
                        {STATUS_ICONS[s]}
                      </div>
                      <span className={`text-xs font-medium hidden sm:block ${i <= currentStepIdx ? 'text-sky-600' : 'text-gray-400'}`}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item._id} className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" onError={e => e.target.src = 'https://via.placeholder.com/64'} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Price */}
          <div className="glass-card p-5 rounded-2xl">
            <h3 className="font-bold text-gray-900 mb-3">Price Details</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{order.itemsPrice.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? <span className="text-green-500">FREE</span> : `₹${order.shippingPrice}`}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>₹{order.taxPrice.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t"><span>Total</span><span>₹{order.totalPrice.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Shipping */}
          <div className="glass-card p-5 rounded-2xl">
            <h3 className="font-bold text-gray-900 mb-3">Shipping To</h3>
            <p className="font-semibold text-gray-800">{order.shippingAddress.fullName}</p>
            <p className="text-gray-500 text-sm">{order.shippingAddress.street}</p>
            <p className="text-gray-500 text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            {order.shippingAddress.phone && <p className="text-gray-500 text-sm mt-1">📞 {order.shippingAddress.phone}</p>}
          </div>

          {/* Payment */}
          <div className="glass-card p-5 rounded-2xl">
            <h3 className="font-bold text-gray-900 mb-2">Payment</h3>
            <p className="text-gray-600 text-sm">{order.paymentMethod}</p>
            <p className={`text-sm font-semibold mt-1 ${order.isPaid ? 'text-green-500' : 'text-amber-500'}`}>
              {order.isPaid ? '✓ Paid' : '⏳ Pending'}
            </p>
            {order.estimatedDelivery && (
              <p className="text-xs text-gray-400 mt-2">Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};