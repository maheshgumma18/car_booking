const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Garage = require("../models/Garage");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed!"), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Controller function to handle image upload and garage creation
const uploadGarageImages = async (req, res) => {
    
  const { name, ownerName, location, availableServices, contactDetails } = req.body;
 console.log(req.body)
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const garageImages = req.files.map((file) => file.path);

  const garage = new Garage({
    name,
    ownerName,
    location: JSON.parse(location), // Parse location if sent as JSON string
    availableServices: JSON.parse(availableServices), // Parse availableServices array
    contactDetails: JSON.parse(contactDetails), // Parse contactDetails object
    garageImages,
  });

  try {
    const savedGarage = await garage.save();
    res.status(201).json({ message: "Garage created successfully", garage: savedGarage });
  } catch (error) {
    res.status(500).json({ message: "Error creating garage", error: error.message });
  }
};

// Update garage details with image upload
const updateGarageDetails = async (req, res) => {
  const { garageId } = req.params;
  const { name, ownerName, location, availableServices, contactDetails } = req.body;

  try {
    const garage = await Garage.findById(garageId);

    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    // Update fields
    if (name) garage.name = name;
    if (ownerName) garage.ownerName = ownerName;
    if (location) garage.location = JSON.parse(location);
    if (availableServices) garage.availableServices = JSON.parse(availableServices);
    if (contactDetails) garage.contactDetails = JSON.parse(contactDetails);

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      // Remove old images
      garage.garageImages.forEach((imagePath) => {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the old image file
        }
      });

      // Save new images
      garage.garageImages = req.files.map((file) => file.path);
    }

    const updatedGarage = await garage.save();
    res.status(200).json({ message: "Garage updated successfully", garage: updatedGarage });
  } catch (error) {
    res.status(500).json({ message: "Error updating garage", error: error.message });
  }
};

// Find nearby garages based on geospatial query
const findNearbyGarages = async (req, res) => {
  const { latitude, longitude, radius } = req.body;

  if (!latitude || !longitude || !radius) {
    return res.status(400).json({ message: "Latitude, longitude, and radius are required." });
  }

  try {
    const garages = await Garage.find({
      "location.coordinates": {
        $geoWithin: {
          $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], parseFloat(radius) / 6378.1], // Convert radius to radians
        },
      },
    });

    res.status(200).json({ message: "Nearby garages fetched successfully", garages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching nearby garages", error: error.message });
  }
};

// Get all garages (for testing purposes)
const getAllGarages = async (req, res) => {
  try {
    console.log(req.body)
    const garages = await Garage.find({});
    if (garages.length > 0) {
      return res.status(200).json({ message: "Garages retrieved successfully", garages });
    } else {
      return res.status(200).json({ message: "No garages found" });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deleteGarages = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedGarage = await Garage.findByIdAndDelete(id);
      if (!deletedGarage) {
        return res.status(404).json({ message: "Garage not found" });
      }
      res.status(200).json({ message: "Garage deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting garage", error: error.message });
    }
  };
  

// Export multer upload middleware and controller functions
module.exports = {
  uploadMiddleware: upload.array("garageImages", 5), // Limit to 5 images
  uploadGarageImages,
  updateGarageDetails,
  findNearbyGarages,
  getAllGarages,
  deleteGarages
};
