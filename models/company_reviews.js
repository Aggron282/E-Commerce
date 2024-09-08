const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const review_schema = new Schema(
  {
    title:{
      type:String,
      required:false
    },
    description:{
      type:String,
      required:false
    },
    profileImg:{
      type:String,
      required:false
    },
    name:{
      type:String,
      required:false
    }

  }

);

module.exports = mongoose.model("Reviews",review_schema);
