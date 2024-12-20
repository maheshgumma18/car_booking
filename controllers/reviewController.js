const Review=require('../models/reviews')

exports.addReview= async(req,res)=>{

    try {
    const {review,rating}=req.body
    
    const revw=new Review({id:req.user._id,review:review,rating:rating})
    await revw.save()
    return res.status(200).json({msg:'review created succesfully'})
    } catch (error) {
        return res.status(500).json({msg:'review creation failed'})
    }
}

exports.getReview= async (req,res)=>{
   
    try {
        const revws=await Review.aggregate([
         {$limit:10}
        ]);

        return res.status(200).json({status:'success',data:revws})

    } catch (error) {
        return res.status(500).json({status:'failed',data:'no reviews'})
    }
}