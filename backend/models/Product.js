const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Food & Grocery', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Automotive', 'Other']
  },
  brand: { type: String, default: 'LocalMart' },
  images: [{ type: String }],
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  sold: { type: Number, default: 0 },
  weight: Number,
  dimensions: { length: Number, width: Number, height: Number }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);