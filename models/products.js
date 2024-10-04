const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const product_schema = new Schema(
  {
    title:{
      type:String,
      required:true
    },
    price:{
      type:Number,
      required:false
    },
    description:{
      type:String,
      required:true
    },
    catagory:{
      type:String,
      required:true
    },
    discount:{
      type:Number,
      required:true
    },

    thumbnail:{
      type:String,
      required:false
    },
    banner:{
      type:String,
      required:true
    },
    quantity:{
      type:Number,
      required:true
    },
    banner:{
      type:String,
      required:true
    },
    userId:{
      type:Schema.Types.ObjectId,
      ref:"User",
      required:true
    }

  }

)

module.exports =mongoose.model("Product",product_schema);
