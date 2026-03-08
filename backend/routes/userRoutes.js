const router = require('express').Router();
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');

// Get recently viewed
router.get('/recently-viewed', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('recentlyViewed', 'name image price rating category').select('recentlyViewed');
  res.json({ success: true, data: user.recentlyViewed });
}));

// Get wishlist
router.get('/wishlist', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name image price rating category stock').select('wishlist');
  res.json({ success: true, data: user.wishlist });
}));

module.exports = router;