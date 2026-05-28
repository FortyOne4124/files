const express     = require('express');
const router      = express.Router();
const authMiddleware = require('../middleware/auth');
const { getUserBookings, createBooking, addReview } = require('../controllers/bookingController');

/* Все маршруты требуют авторизации */
router.use(authMiddleware);

router.get('/',        getUserBookings);
router.post('/',       createBooking);
router.post('/review', addReview);

module.exports = router;
