const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Product = require("./products.js");

const {ObjectId} = require("mongodb");

const admin = new Schema(
  {
    name:{
      type:String,
      required:true
    },
    location:{
      type:Object,
      required:false
    },
    email:{
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true
    },
    profileImg:{
      type:String,
      required:false
    },
    products:{
      type:Array,
      required:true
    },
    resetToken:String,
    resetTokenExpiration:Date,
  }

);

admin.methods.deleteProduct = function(id,cb){
  cb("Delete One Product");
}

module.exports = mongoose.model("admins",admin);
