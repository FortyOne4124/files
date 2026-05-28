const express          = require('express');
const router           = express.Router();
const adminAuthMiddleware = require('../middleware/adminAuth');
const { getAllBookings, updateBookingStatus } = require('../controllers/adminController');

/* Все маршруты требуют токена администратора */
router.use(adminAuthMiddleware);

router.get('/bookings',        getAllBookings);
router.patch('/bookings/:id',  updateBookingStatus);

module.exports = router;
