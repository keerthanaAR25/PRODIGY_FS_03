const router = require('express').Router();
const { register, login, getProfile, updateProfile, markNotificationsRead } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/notifications/read', protect, markNotificationsRead);

module.exports = router;