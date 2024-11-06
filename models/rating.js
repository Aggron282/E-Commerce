const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ProductReview = new Schema({
    heading:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    user_info:{
        _id:{
            type:mongoose.Types.ObjectId,
            required:true
        },
        name:{
            type:String,
            required:true   
        },
        profileImg:{
            type:String,
            required:false
        }
    },
    product_id:{
        type:mongoose.Types.ObjectId,
        required:true
    }
})

module.exports = mongoose.model("product_reviews",ProductReview);