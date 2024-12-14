const Car = require('../models/Car');

// Add Car
exports.addCar = async (req, res) => {
    try {
        const car = await Car.create(req.body);
        res.status(201).json(car);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Cars
exports.getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
