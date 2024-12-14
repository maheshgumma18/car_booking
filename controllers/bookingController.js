const Booking = require('../models/Booking');
const Car = require('../models/Car');

// Create Booking
exports.createBooking = async (req, res) => {
    try {
        const { carId, startTime, endTime } = req.body;

        const car = await Car.findById(carId);
        if (!car || !car.availability) {
            return res.status(400).json({ message: 'Car not available' });
        }

        const totalPrice = Math.ceil((new Date(endTime) - new Date(startTime)) / 3600000) * car.rentPerHour;

        const booking = await Booking.create({
            user: req.user._id,
            car: car._id,
            startTime,
            endTime,
            totalPrice,
        });

        car.availability = false;
        await car.save();

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Bookings
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('car');
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
