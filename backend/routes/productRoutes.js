const router = require('express').Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getFeaturedProducts, toggleWishlist } = require('../controllers/productController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', optionalAuth, getProduct);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/wishlist', protect, toggleWishlist);

module.exports = router;