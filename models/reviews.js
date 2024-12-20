const mongoose=require('mongoose')

const reviewSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    review:{type:String},
    rating:{type:Number}


})

module.exports=mongoose.model('Reviews',reviewSchema)