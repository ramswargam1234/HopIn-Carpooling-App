const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const c = require('../controllers/booking.controller');

router.post('/', auth, c.createBooking);
router.get('/mine', auth, c.getMyBookings);
router.get('/driver', auth, c.getBookingsForMyRides);
router.put('/:id/status', auth, c.updateBookingStatus);
router.put('/:id/cancel', auth, c.cancelBooking);

module.exports = router;
