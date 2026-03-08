const router = require('express').Router();
const { getAnalytics, getUsers, toggleUserStatus } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/analytics', protect, admin, getAnalytics);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/toggle', protect, admin, toggleUserStatus);

module.exports = router;