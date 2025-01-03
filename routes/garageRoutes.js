const express = require("express");
const { uploadMiddleware, uploadGarageImages,updateGarageDetails ,findNearbyGarages,getAllGarages,deleteGarages} = require("../controllers/GarageController");
const router = express.Router();


router.post("/upload", uploadMiddleware, uploadGarageImages);
router.post("/:garageId",updateGarageDetails)
router.get("/nearby",findNearbyGarages)
router.get("/all",getAllGarages)
router.delete('/:id',deleteGarages)
module.exports = router;
