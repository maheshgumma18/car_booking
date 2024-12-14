const express = require('express');
const { createBooking, getBookings } = require('../controllers/bookingController');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);

module.exports = router;
