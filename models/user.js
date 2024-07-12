const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./products.js");
const {ObjectId} = require("mongodb");

const user = new Schema(
  {
    name:{
      type:String,
      required:true
    },
    email:{
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true
    },
    resetToken:String,
    resetTokenExpiration:Date,
    cart:{
        items:[
          {
          prodId:{
            type:Schema.Types.ObjectId,
            ref:"Product",
            required:true
          },
          data:{
            type:Object,
            ref:"Product_Data",
            required:true
          },
          quantity:{
            type:Number,
            required:true
          }
        }
      ]
    }
  }
);

user.methods.ClearCart = function(){
  this.cart = {
    items:[]
  }
  this.save();
}

user.methods.AddCart = function(id){

  Product.findById(id).then((item) =>{
    console.log(item);
    if (this.cart.items.length <= 0) {
      this.cart = {
        items:[{
          prodId:item._id,
          data:item,
          quantity:1
        }]
      }
    //  console.log(this.cart);
      this.save();
      return;
    }else{

         var exisiting_product_index = this.cart.items.findIndex(prod => prod.prodId == id);
         var existing_product = this.cart.items[exisiting_product_index];
         var items = [...this.cart.items];
         var updated_product = {
           prodId:item._id,
           data:item,
           quantity:item.quantity
         };
         console.log(updated_product)
         if(existing_product){
           updated_product.quantity = updated_product.quantity + 1;
           items[exisiting_product_index] = updated_product;
         }else{
           updated_product.quantity = 1;
           items.push(updated_product);
         }
         var updated_cart = {
           items:items
         }
         console.log(updated_cart);
         this.cart = updated_cart;
         this.save();
        }
   })
}

user.methods.deleteProduct = function(id){

    var updated_items = this.cart.items.filter((p) => {
      return p._id == new ObjectId(id)
    });
    console.log(updated_items)
    var new_cart = {
      items:updated_items,
    };

    this.cart = new_cart;

    this.save();

}

module.exports = mongoose.model("User",user);



// const db = require("./../util/db.js");
// const {ObjectId} = require("mongodb");
//
// class User {
//
//   constructor(email,name,cart,_id){
//     this.email = email
//     this.name = name;
//     this._id = _id;
//     this.cart = cart;
//   }
//
//    async addCart(product){
//     const updatedCart = {items:[{...product,quantity:1}]};
//     const db_ = db.GetDB();
//     const update_ = await db_.collection("users").updateOne({_id:new ObjectId(this._id)},{$set:{cart:updatedCart}});
//   }
//
//   deleteProduct(id,cb){
//     const db_ = db.GetDB();
//
//     var updated_items = this.cart.items.filter((p) => {
//       return p._id == new ObjectId(id)
//     });
//
//     var new_cart = {
//       items:updated_items,
//     };
//
//     var update = {
//       $set:{
//         cart:new_cart
//       }
//     }
//
//     var query = {
//       _id:new ObjectId(this._id)
//     }
//
//     const db_exec = db_.collection("users").updateOne(query,update);
//     cb(db_exec);
//   }
//
//   save(){
//     const db_ = db.GetDB();
//     db_.collection("users").insertOne(this);
//   }
//
//   async addOrder(){
//
//     const db_ = db.GetDB();
//
//     this.getUser(async (user)=>{
//
//       var new_order  = {
//         user:{
//           name:user.name,
//           email:user.email,
//           _id:new ObjectId(user._id)
//         },
//         items:user.cart.items
//       }
//
//       return db_.collection("orders").insertOne(new_order).then((response)=>{
//
//       var empty_cart = {
//         items:[]
//       }
//
//       var update_ = {
//         $set:{
//           cart:empty_cart
//         }
//       }
//
//       var query = {
//         _id: new ObjectId(user._id)
//       }
//
//       db_.collection("users").updateOne(query,update_);
//       console.log(response)
//     });
//
//   })
//
//   }
//
//   async getUser(cb){
//     const db_ = db.GetDB();
//     var user_ = await db_.collection("users").findOne({_id:new ObjectId(this._id)});
//     cb(user_)
//   }
//
//
//   static async findDefault(cb){
//     const db_ = db.GetDB();
//     const users =  await db_.collection("users").find({}).toArray();
//     cb(users);
//   }
//
//   static async findById(id,cb){
//     const db_ = db.GetDB();
//     const user =  await db_.collection("users").findOne({_id:new ObjectId(id)});
//     cb(user);
//   }
//
// }
//
//
// module.exports = User;
