const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc Create order
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
  if (!items?.length) { res.status(400); throw new Error('No order items'); }

  const order = await Order.create({
    user: req.user._id, items, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
    statusHistory: [{ status: 'Pending', note: 'Order placed' }],
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  // Update stock & sold
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity }
    });
  }

  // Add notification
  await User.findByIdAndUpdate(req.user._id, {
    $push: { notifications: { message: `Order #${order.orderNumber} placed successfully!`, type: 'order' } }
  });

  res.status(201).json({ success: true, data: order });
});

// @desc Get my orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// @desc Get single order
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, data: order });
});

// @desc Update payment
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;
  const updated = await order.save();
  res.json({ success: true, data: updated });
});

// @desc Get all orders (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { status } : {};
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
  res.json({ success: true, data: orders, total });
});

// @desc Update order status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.status = req.body.status;
  order.statusHistory.push({ status: req.body.status, note: req.body.note || '' });
  if (req.body.status === 'Delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }
  const updated = await order.save();

  // Notify user
  await User.findByIdAndUpdate(order.user, {
    $push: { notifications: { message: `Your order #${order.orderNumber} is now ${req.body.status}`, type: 'order' } }
  });

  res.json({ success: true, data: updated });
});

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderToPaid, getAllOrders, updateOrderStatus };