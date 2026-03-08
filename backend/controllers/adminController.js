const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc Get dashboard analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const [totalOrders, totalRevenue, totalCustomers, totalProducts] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments()
  ]);

  // Orders today
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } });

  // Revenue last 7 days
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const salesChart = await Order.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  // Top products
  const topProducts = await Product.find().sort({ sold: -1 }).limit(5).select('name sold price image rating');

  // Recent orders
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

  // Orders by status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.json({
    success: true, data: {
      totalOrders, ordersToday,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCustomers, totalProducts,
      salesChart, topProducts, recentOrders, ordersByStatus
    }
  });
});

// @desc Get all users (admin)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

// @desc Toggle user status
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: user });
});

module.exports = { getAnalytics, getUsers, toggleUserStatus };