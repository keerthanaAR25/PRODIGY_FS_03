import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiBarChart2,
  FiMenu, FiX, FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye
} from 'react-icons/fi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import FlashCard from '../components/common/FlashCard';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLORS_CLASS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

const SIDEBAR_ITEMS = [
  { icon: <FiGrid size={18} />, label: 'Dashboard', key: 'dashboard' },
  { icon: <FiPackage size={18} />, label: 'Products', key: 'products' },
  { icon: <FiShoppingBag size={18} />, label: 'Orders', key: 'orders' },
  { icon: <FiUsers size={18} />, label: 'Customers', key: 'customers' },
  { icon: <FiBarChart2 size={18} />, label: 'Analytics', key: 'analytics' }
];

// ===== DASHBOARD OVERVIEW =====
const DashboardOverview = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const COLORS = ['#0ea5e9', '#f97316', '#10b981', '#8b5cf6', '#ec4899'];
  const pieData = (analytics.ordersByStatus || []).map(s => ({ name: s._id, value: s.count }));
  const chartData = (analytics.salesChart || []).map(d => ({
    date: d._id ? d._id.slice(5) : '',
    revenue: Math.round(d.revenue || 0),
    orders: d.orders || 0
  }));

  return (
    <div className="space-y-6">
      {/* Flash Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FlashCard title="Total Orders" value={analytics.totalOrders || 0} icon="🛒" gradient="linear-gradient(135deg, #0ea5e9, #0369a1)" delay={0} />
        <FlashCard title="Revenue" value={analytics.totalRevenue || 0} icon="💰" gradient="linear-gradient(135deg, #10b981, #059669)" prefix="₹" delay={0.1} />
        <FlashCard title="Customers" value={analytics.totalCustomers || 0} icon="👥" gradient="linear-gradient(135deg, #f97316, #ea580c)" delay={0.2} />
        <FlashCard title="Products" value={analytics.totalProducts || 0} icon="📦" gradient="linear-gradient(135deg, #8b5cf6, #6d28d9)" delay={0.3} />
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Orders Today', value: analytics.ordersToday || 0, color: 'text-sky-500' },
          { label: 'Revenue Today', value: `₹${((analytics.recentOrders || []).filter(o => {
            const d = new Date(o.createdAt); const t = new Date(); return d.toDateString() === t.toDateString();
          }).reduce((a, o) => a + (o.totalPrice || 0), 0)).toLocaleString()}`, color: 'text-green-500' },
          { label: 'Pending Orders', value: (analytics.ordersByStatus || []).find(s => s._id === 'Pending')?.count || 0, color: 'text-amber-500' }
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-gray-900 mb-5">Revenue — Last 7 Days</h3>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm">No sales data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, n) => [n === 'revenue' ? `₹${v.toLocaleString()}` : v, n === 'revenue' ? 'Revenue' : 'Orders']} />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-gray-900 mb-5">Orders by Status</h3>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm">No orders yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-gray-900 mb-4">🏆 Top Selling Products</h3>
          {(analytics.topProducts || []).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {(analytics.topProducts || []).map((p, i) => (
                <div key={p._id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100" onError={e => e.target.src = 'https://via.placeholder.com/40'} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.sold} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-sky-500">₹{p.price.toLocaleString()}</p>
                    <p className="text-xs text-amber-500">★ {p.rating?.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-gray-900 mb-4">🕒 Recent Orders</h3>
          {(analytics.recentOrders || []).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {(analytics.recentOrders || []).map(order => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 font-mono">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.user?.name || 'Guest'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">₹{order.totalPrice?.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS_CLASS[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== PRODUCTS MANAGEMENT =====
const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { name: '', description: '', price: '', originalPrice: '', category: 'Electronics', stock: '', image: '', brand: '', isFeatured: false, isNew: false };
  const [form, setForm] = useState(emptyForm);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (search) params.append('keyword', search);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name, description: product.description,
      price: product.price, originalPrice: product.originalPrice || '',
      category: product.category, stock: product.stock,
      image: product.image, brand: product.brand || '',
      isFeatured: product.isFeatured || false, isNew: product.isNew || false
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/products/${editing}`, form);
        toast.success('✅ Product updated!');
      } else {
        await api.post('/products', form);
        toast.success('✅ Product created!');
      }
      setShowForm(false); setEditing(null); setForm(emptyForm);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try { await api.delete(`/products/${id}`); toast.success('Product deleted'); fetchProducts(); }
    catch { toast.error('Failed to delete'); }
  };

  const CATEGORIES = ['Electronics', 'Clothing', 'Food & Grocery', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Automotive', 'Other'];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Products Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={15} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 w-48 bg-white"
            />
          </div>
          <button
            onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-md"
          >
            <FiPlus size={16} /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array(6).fill(0).map((_, i) => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📦</div>
          <p>No products found</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Sold', 'Tags', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p, idx) => (
                  <motion.tr key={p._id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-11 h-11 rounded-xl object-cover bg-gray-100 flex-shrink-0" onError={e => e.target.src = 'https://via.placeholder.com/44'} />
                        <div>
                          <p className="font-semibold text-gray-800 max-w-[180px] truncate">{p.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            {p.isFeatured && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Featured</span>}
                            {p.isNew && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">New</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium whitespace-nowrap">{p.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-bold text-gray-800">₹{p.price.toLocaleString()}</span>
                        {p.originalPrice > p.price && (
                          <span className="block text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-sm ${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-amber-500' : 'text-green-500'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-amber-500 font-semibold">★ {p.rating?.toFixed(1) || '0.0'}</span>
                      <span className="text-gray-400 text-xs ml-1">({p.numReviews})</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-medium">{p.sold || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {(p.tags || []).slice(0, 2).map(t => (
                          <span key={t} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-sky-500 hover:bg-sky-50 rounded-lg transition-colors" title="Edit">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => deleteProduct(p._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900 text-lg">{editing ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Samsung 4K TV 55&quot;" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Brand</label>
                    <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Samsung" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required placeholder="Describe the product..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL *</label>
                  <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} required placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
                  {form.image && <img src={form.image} alt="preview" className="mt-2 h-20 rounded-xl object-cover" onError={e => e.target.style.display = 'none'} />}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[['price', 'Price (₹) *', true], ['originalPrice', 'Original (₹)', false], ['stock', 'Stock *', true]].map(([k, l, req]) => (
                    <div key={k}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{l}</label>
                      <input type="number" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required={req} min="0" placeholder="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-6 pt-1">
                  {[['isFeatured', '⭐ Featured'], ['isNew', '🆕 New Arrival']].map(([k, l]) => (
                    <label key={k} className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={form[k]} onChange={e => setForm({ ...form, [k]: e.target.checked })} className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400" />
                      <span className="text-sm text-gray-700 font-medium">{l}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-md">
                    {editing ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== ORDERS MANAGEMENT =====
const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/orders?status=${statusFilter}` : '/orders';
      const { data } = await api.get(url);
      setOrders(data.data || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status, note: `Status updated to ${status} by admin` });
      setOrders(orders.map(o => o._id === id ? { ...o, status: data.data.status } : o));
      if (selectedOrder?._id === id) setSelectedOrder({ ...selectedOrder, status: data.data.status });
      toast.success(`✅ Order marked as ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Orders Management</h2>
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
        >
          <option value="">All Orders</option>
          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{Array(6).fill(0).map((_, i) => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><div className="text-5xl mb-3">📋</div><p>No orders found</p></div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order, idx) => (
                  <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-gray-700">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{order.user?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[120px]">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.items?.length || 0} items</td>
                    <td className="px-4 py-3 font-bold text-gray-800">₹{order.totalPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.isPaid ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS_CLASS[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-sky-500 hover:bg-sky-50 rounded-lg transition-colors" title="View Details">
                          <FiEye size={14} />
                        </button>
                        <select
                          onChange={e => { if (e.target.value) updateStatus(order._id, e.target.value); e.target.value = ''; }}
                          defaultValue=""
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-400 bg-white cursor-pointer"
                        >
                          <option value="" disabled>Update</option>
                          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].filter(s => s !== order.status).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Order #{selectedOrder.orderNumber}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS_CLASS[selectedOrder.status]}`}>{selectedOrder.status}</span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><FiX /></button>
              </div>

              <div className="space-y-4">
                {/* Items */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Order Items</p>
                  {selectedOrder.items?.map(item => (
                    <div key={item._id} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0" onError={e => e.target.src = 'https://via.placeholder.com/48'} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-800 flex-shrink-0">₹{(item.price * item.quantity)?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{selectedOrder.itemsPrice?.toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{selectedOrder.shippingPrice === 0 ? <span className="text-green-500">FREE</span> : `₹${selectedOrder.shippingPrice}`}</span></div>
                  <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{selectedOrder.taxPrice?.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-1.5 border-t border-gray-200"><span>Total</span><span>₹{selectedOrder.totalPrice?.toLocaleString()}</span></div>
                </div>

                {/* Shipping + Payment */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-blue-600 mb-1.5">📦 SHIPPING TO</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedOrder.shippingAddress?.fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedOrder.shippingAddress?.street}</p>
                    <p className="text-xs text-gray-500">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                    {selectedOrder.shippingAddress?.phone && <p className="text-xs text-gray-500 mt-0.5">📞 {selectedOrder.shippingAddress?.phone}</p>}
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-600 mb-1.5">💳 PAYMENT</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedOrder.paymentMethod}</p>
                    <p className={`text-xs mt-1 font-semibold ${selectedOrder.isPaid ? 'text-green-600' : 'text-amber-500'}`}>
                      {selectedOrder.isPaid ? '✓ Paid' : '⏳ Awaiting payment'}
                    </p>
                    {selectedOrder.estimatedDelivery && (
                      <p className="text-xs text-gray-400 mt-1">Est: {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    )}
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                      <button key={s} onClick={() => updateStatus(selectedOrder._id, s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${selectedOrder.status === s ? 'bg-sky-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== CUSTOMERS PANEL =====
const CustomersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data.data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle`);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: data.data.isActive } : u));
      toast.success('User status updated');
    } catch { toast.error('Failed to update'); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Customers</h2>
          <p className="text-sm text-gray-400">{users.filter(u => u.role === 'customer').length} registered customers</p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 w-52 bg-white" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array(6).fill(0).map((_, i) => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}</div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['User', 'Role', 'Phone', 'Wishlist', 'Joined', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user, idx) => (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {user.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{user.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{user.wishlist?.length || 0} items</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {user.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.role !== 'admin' && (
                        <button onClick={() => toggleStatus(user._id)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${user.isActive ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== ANALYTICS PANEL =====
const AnalyticsPanel = ({ analytics }) => {
  if (!analytics) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;

  const COLORS = ['#0ea5e9', '#f97316', '#10b981', '#8b5cf6'];
  const chartData = (analytics.salesChart || []).map(d => ({
    date: d._id ? d._id.slice(5) : '',
    revenue: Math.round(d.revenue || 0),
    orders: d.orders || 0
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Analytics & Reports</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FlashCard title="Total Revenue" value={analytics.totalRevenue || 0} icon="💵" gradient="linear-gradient(135deg, #10b981, #059669)" prefix="₹" delay={0} />
        <FlashCard title="Total Orders" value={analytics.totalOrders || 0} icon="📦" gradient="linear-gradient(135deg, #0ea5e9, #0369a1)" delay={0.1} />
        <FlashCard title="Total Customers" value={analytics.totalCustomers || 0} icon="👤" gradient="linear-gradient(135deg, #f97316, #ea580c)" delay={0.2} />
        <FlashCard title="Avg Order Value" value={analytics.totalOrders ? Math.round(analytics.totalRevenue / analytics.totalOrders) : 0} icon="📊" gradient="linear-gradient(135deg, #8b5cf6, #6d28d9)" prefix="₹" delay={0.3} />
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h3 className="font-bold text-gray-900 mb-5">Revenue & Orders — Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
            <Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-gray-900 mb-4">Order Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={(analytics.ordersByStatus || []).map(s => ({ name: s._id, value: s.count }))} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {(analytics.ordersByStatus || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-gray-900 mb-4">Top Products Performance</h3>
          <div className="space-y-3">
            {(analytics.topProducts || []).map((p, i) => {
              const max = analytics.topProducts?.[0]?.sold || 1;
              return (
                <div key={p._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 truncate max-w-[60%]">{p.name}</span>
                    <span className="text-gray-500 font-semibold">{p.sold} sold</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${(p.sold / max) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN ADMIN LAYOUT =====
const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      api.get('/admin/analytics').then(({ data }) => setAnalytics(data.data)).catch(console.error);
    }
  }, [isAdmin]);

  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview analytics={analytics} />;
      case 'products': return <ProductsManagement />;
      case 'orders': return <OrdersManagement />;
      case 'customers': return <CustomersPanel />;
      case 'analytics': return <AnalyticsPanel analytics={analytics} />;
      default: return <DashboardOverview analytics={analytics} />;
    }
  };

  return (
    <div className="min-h-screen pt-16 flex bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 z-30 overflow-hidden shadow-lg"
          >
            <div className="p-4 h-full flex flex-col">
              {/* Admin info */}
              <div className="flex items-center gap-3 p-3 mb-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-sky-600 font-semibold">Administrator</p>
                </div>
              </div>

              {/* Nav Items */}
              <nav className="flex-1 space-y-1">
                {SIDEBAR_ITEMS.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`sidebar-nav-item w-full text-sm font-medium ${activeTab === item.key ? 'active' : ''}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    {activeTab === item.key && (
                      <motion.div layoutId="activeTab" className="ml-auto w-1.5 h-4 bg-white rounded-full opacity-60" />
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">LocalMart Admin v1.0</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div>
            <h1 className="font-display font-bold text-gray-900 text-lg capitalize">{activeTab}</h1>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;