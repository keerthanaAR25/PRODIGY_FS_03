const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// @desc Register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) { res.status(400); throw new Error('All fields required'); }
  if (await User.findOne({ email })) { res.status(400); throw new Error('Email already registered'); }
  const user = await User.create({ name, email, password });
  res.status(201).json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) }
  });
});

// @desc Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error('Invalid email or password'); }
  res.json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, token: generateToken(user._id) }
  });
});

// @desc Get profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name image price rating').select('-password');
  res.json({ success: true, data: user });
});

// @desc Update profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  if (req.body.address) user.address = { ...user.address, ...req.body.address };
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({ success: true, data: { _id: updated._id, name: updated.name, email: updated.email, role: updated.role, token: generateToken(updated._id) } });
});

// @desc Mark notifications read
const markNotificationsRead = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { 'notifications.$[].read': true } });
  res.json({ success: true, message: 'Notifications marked read' });
});

module.exports = { register, login, getProfile, updateProfile, markNotificationsRead };