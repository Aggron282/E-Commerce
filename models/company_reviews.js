const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const review_schema = new Schema(
  {
    heading:{
      type:String,
      required:false
    },
    description:{
      type:String,
      required:false
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
    rating:{
      type:Number,
      required:true
    }

  }

);

module.exports = mongoose.model("Reviews",review_schema);
