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
      required:true
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
      required:true
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
    },
  }
)

module.exports =mongoose.model("Product",product_schema);


// var path = require("path");
// var fs = require("fs");
// const p = path.join(path.dirname(process.mainModule.filename),"data","products.json");
// var db = require("./../util/db.js");
// const { ObjectId } = require('mongodb');
//
//
// const GetAllProducts = async (cb) =>{
//
//   var all_products = await db_.collection("products").find({}).toArray();
//
//   cb(all_products);
//
// }
//
// class Products {
//
//   constructor(title,quantity,description,price,discount,catagory,banner,thumbnail,userId){
//
//     this.title = title;
//     this.quantity = quantity;
//     this.userId = new ObjectId(userId._id);
//     this.description = description;
//     this.thumbnail = thumbnail;
//     this.price = price <= 1 ? 1 : parseInt(price);
//     this.catagory = catagory;
//     this.banner = banner;
//     this.discount = discount;
//
//   }
//
//   async save(){
//
//       var db_ = db.GetDB();
//
//       var products = await db_.collection("products").find({}).toArray();
//
//       var found = false;
//
//       for(var i =0; i < products.length; i++){
//
//         if(products[i].title == this.title && !found){
//
//             var found = true;
//             var qu =  parseInt(products[i].quantity);
//
//             var query =   {
//               _id: new ObjectId(products[i].title_id)
//             };
//             var update_params = {$set: {"qty": parseInt(this.quantity) + qu}};
//
//             db_.collection("products").updateOne(query,update_params)
//
//           }
//
//         }
//
//         if(!found){
//           db_.collection("products").insertOne(this);
//         }
//
//
//    }
//
//
//   static async DeleteOneProduct(id,cb){
//
//       var db_ = db.GetDB();
//
//       var _id = new ObjectId(id);
//
//       var query = {
//         _id:_id
//       }
//
//       var response = db_.collection("products").deleteOne(query);
//
//       cb(response);
//
//   }
//
//   static async EditOneProduct(edited_product,cb){
//
//       var db_ = db.GetDB();
//
//       //var product_one = await db_.collection("products").findOne({_id:new ObjectId(edited_product.id)});
//       var product_new = {...edited_product};
//
//       product_new.title = edited_product.title;
//       product_new.price = edited_product.price;
//       product_new.description = edited_product.description;
//       product_new.quantity = edited_product.quantity;
//       product_new.banner = edited_product.banner;
//       product_new.thumbnail = edited_product.thumbnail;
//       product_new.catagory = edited_product.catagory;
//       product_new.discount = edited_product.discount;
//
//       var {title,price,description,banner,quantity,thumbnail,catagory,discount,_id} = product_new;
//
//       const query = {
//           _id:new ObjectId(edited_product._id)
//         }
//
//       const update_params = {
//         $set: {
//           title:title,
//           price:price,
//           description:description,
//           banner:banner,
//           quantity:quantity,
//           thumbnail:thumbnail,
//           catagory:catagory,
//           discount:discount
//         }
//       }
//
//       var response = await db_.collection("products").updateOne(query,update_params);
//
//       cb(response);
//
//   }
//
//   static async FetchAll(cb){
//
//     var db_ = db.GetDB();
//     var products = await db_.collection("products").find({}).toArray();
//
//     cb(products);
//
//   }
//
//   static async findById(id,cb){
//     var db_ = db.GetDB();
//     var query = {_id:id};
//     var product = await db_.collection("products").findOne({_id:new ObjectId(id)});
//
//     cb(product);
//
//   }
//
//
// }
//
//
// module.exports = Products;
