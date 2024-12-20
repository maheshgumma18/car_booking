const express=require('express')
const {addReview,getReview}=require('../controllers/reviewController')
const {protect}=require('../middlewares/authMiddleware')
 const router=express.Router()

router.get('/',getReview)
router.post('/',protect,addReview)

module.exports=router