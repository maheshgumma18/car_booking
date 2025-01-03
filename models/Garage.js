const mongoose = require("mongoose");

const garageSchema = new mongoose.Schema({
  name: String,
  ownerName: String,
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      type: [Number],  // GeoJSON format [longitude, latitude]
      required: true,
      index: "2dsphere",  // Indexing the coordinates as a 2dsphere for geospatial queries
    },
  },
  availableServices: [String],
  contactDetails: {
    phone: String,
    email: String,
  },
  garageImages: [String],
});

module.exports = mongoose.model("Garage", garageSchema);
