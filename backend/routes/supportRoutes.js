const router = require('express').Router();
const { createTicket, getMyTickets, getAllTickets, updateTicket } = require('../controllers/supportController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, createTicket);
router.get('/my', protect, getMyTickets);
router.get('/', protect, admin, getAllTickets);
router.put('/:id', protect, admin, updateTicket);

module.exports = router;