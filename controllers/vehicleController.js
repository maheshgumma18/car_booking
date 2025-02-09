const User=require('../models/User')
const Vehicle = require('../models/Vehicle');

exports.addVehicleToUser = async (req,res) => {
  try {
    
    const user = await User.findById({ _id: req.user._id });
  console.log('user is:',user)
    const {make,model,year,registration_number}=req.body
    const vehicle = await Vehicle.create({
      make: make,
      model: model,
      year: year,
      registration_number: registration_number,
      userId: user._id, 
    });


    user.vehicles.push(vehicle._id);
    await user.save();
    await vehicle.save();
    console.log('Vehicle Added:', vehicle);
    return res.status(200).json({msg:'vehicle added succesfully'})
    
  } catch (error) {
    console.error('Error adding vehicle:', error);
    return res.status(400).json({msg:'failed to add vehicle'})
  }
};


exports.myvehicles=async (req,res)=>{
   try {
     const vehicles= await Vehicle.find({userId:req.user._id})
    console.log("vehicles",vehicles)
     if(!vehicles){
        return res.status(400).json({msg:'not vehicles found'})
     }
     return res.status(200).json({'cars':vehicles})
   } catch (error) {
    return res.status(400).json({msg:'error fetching cars'})
   }
}

exports.deleteVehicle = async (req, res) => {
    try {
      const { id } = req.body; 
      console.log("Vehicle ID to delete:", id);
  
      await Vehicle.findByIdAndDelete(id);
  
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ result: "User not found" });
      }
  
      user.vehicles = user.vehicles.filter((val) => val.toString() !== id.toString());
      await user.save();
  
      return res.status(200).json({ result: "Deleted successfully" });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      return res.status(400).json({ result: error.message });
    }
  };
  
