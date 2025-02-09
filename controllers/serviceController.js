const Service = require("../models/Services");


exports.createService = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    const newService = new Service({
      name,
      description,
      price,
      image,
    });

    await newService.save();
    return res.status(201).json({ result: "Service created successfully", service: newService });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(400).json({ result: "Error creating service", error: error.message });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    return res.status(200).json({ result: "Success", services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(400).json({ result: "Error fetching services", error: error.message });
  }
};

// Get a service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ result: "Service not found" });
    }

    return res.status(200).json({ result: "Success", service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return res.status(400).json({ result: "Error fetching service", error: error.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, description, price, image },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ result: "Service not found" });
    }

    return res.status(200).json({ result: "Service updated successfully", service: updatedService });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(400).json({ result: "Error updating service", error: error.message });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ result: "Service not found" });
    }

    return res.status(200).json({ result: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(400).json({ result: "Error deleting service", error: error.message });
  }
};
