const Booking = require('../models/Booking');
const Service = require('../models/Services');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, vehicleId, services, startTime, endTime, notes } = req.body;

    // Validate input
    if (!userId || !vehicleId || !services || !startTime || !endTime) {
      return res.status(400).json({ result: 'Missing required fields' });
    }

    // Validate user and vehicle existence
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ result: 'User not found' });

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ result: 'Vehicle not found' });

    // Validate services and calculate total price
    let totalPrice = 0;
    for (let serviceId of services) {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ result: `Service with ID ${serviceId} not found` });
      }
      totalPrice += service.price;
    }

    // Create a new booking
    const booking = new Booking({
      user: userId,
      vehicle: vehicleId,
      services,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      totalPrice,
      notes,
    });

    await booking.save();

    return res.status(201).json({
      result: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ result: 'Internal Server Error', error: error.message });
  }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.body;

    const bookings = await Booking.find({ user: userId })
      .populate('services')
      .populate('vehicle')
      .exec();

    return res.status(200).json({ result: 'Success', bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ result: 'Internal Server Error', error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!['pending', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ result: 'Invalid booking status' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ result: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    return res.status(200).json({ result: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return res.status(500).json({ result: 'Internal Server Error', error: error.message });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      return res.status(404).json({ result: 'Booking not found' });
    }

    return res.status(200).json({ result: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ result: 'Internal Server Error', error: error.message });
  }
};
