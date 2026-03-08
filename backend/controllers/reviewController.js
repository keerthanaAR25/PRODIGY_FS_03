const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc Add review
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) { res.status(400); throw new Error('Already reviewed'); }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

// @desc Delete review
const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  product.reviews = product.reviews.filter(r => r._id.toString() !== req.params.reviewId);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.length ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length : 0;
  await product.save();
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = { addReview, deleteReview };