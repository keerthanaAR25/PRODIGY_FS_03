const asyncHandler = require('express-async-handler');
const Support = require('../models/Support');

const createTicket = asyncHandler(async (req, res) => {
  const ticket = await Support.create({ ...req.body, user: req.user?._id });
  res.status(201).json({ success: true, data: ticket });
});

const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Support.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: tickets });
});

const getAllTickets = asyncHandler(async (req, res) => {
  const tickets = await Support.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, data: tickets });
});

const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Support.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: ticket });
});

module.exports = { createTicket, getMyTickets, getAllTickets, updateTicket };