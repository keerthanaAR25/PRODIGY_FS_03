const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc Get all products
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;
  const query = {};
  if (keyword) query.$text = { $search: keyword };
  if (category && category !== 'All') query.category = category;
  if (minPrice || maxPrice) query.price = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) };
  if (rating) query.rating = { $gte: Number(rating) };

  const sortMap = {
    'price-asc': { price: 1 }, 'price-desc': { price: -1 },
    'popular': { sold: -1, rating: -1 }, 'newest': { createdAt: -1 },
    'rating': { rating: -1 }
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortOption).skip((page - 1) * limit).limit(Number(limit));

  res.json({ success: true, data: products, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc Get single product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product) { res.status(404); throw new Error('Product not found'); }

  // Track recently viewed
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { recentlyViewed: product._id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { recentlyViewed: { $each: [product._id], $position: 0, $slice: 10 } }
    });
  }
  res.json({ success: true, data: product });
});

// @desc Create product (admin)
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @desc Update product (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, data: product });
});

// @desc Delete product (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, message: 'Product deleted' });
});

// @desc Get featured products
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8);
  res.json({ success: true, data: products });
});

// @desc Toggle wishlist
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.id;
  const idx = user.wishlist.indexOf(productId);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(productId);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getFeaturedProducts, toggleWishlist };