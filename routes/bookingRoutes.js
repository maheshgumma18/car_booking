const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Routes
router.post('/bookings', bookingController.createBooking); // Create a new booking
router.get('/bookings/user', bookingController.getUserBookings); // Get all bookings for a user
router.put('/bookings/status', bookingController.updateBookingStatus); // Update booking status
router.delete('/bookings/:bookingId', bookingController.cancelBooking); // Cancel a booking

module.exports = router;
