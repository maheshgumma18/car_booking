const express=require('express')
 const { addVehicleToUser,myvehicles,deleteVehicle}= require('../controllers/vehicleController')

 const { protect} = require('../middlewares/authMiddleware');
 const router=express.Router()

router.post('/addvehicle',protect,addVehicleToUser)
router.get('/myvehicles',protect,myvehicles)
router.post('/delete',protect,deleteVehicle)

module.exports=router