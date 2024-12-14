const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    name: { type: String, required: true },
    model: { type: String, required: true },
    rentPerHour: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Car', CarSchema);
