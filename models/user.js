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
    location:{
      address:{
        type:String,
        required:false
      },
      coords:{
        latitude:{
          type:Number,
          required:false
        },
        longitude:{
          type:Number,
          required:false
        }
      },
      required:false
    },
    password:{
      type:String,
      required:true
    },
    profileImg:{
      type:String,
      required:false
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

user.methods.AddCart = function(id,quantity){
  Product.findById(id).then((item) =>{

    if (this.cart.items.length <= 0) {
      this.cart = {
        items:[{
          prodId:item._id,
          data:item,
          quantity:quantity
        }]
      }
      this.save();

      return;

    }
    else{

         var exisiting_product_index = this.cart.items.findIndex(prod => prod.prodId == id);
         var existing_product = this.cart.items[exisiting_product_index];
         var items = [...this.cart.items];

         var updated_product = {
           prodId:item._id,
           data:item,
           quantity:quantity
         };

         if(existing_product){
           updated_product.quantity = updated_product.quantity + quantity;
           items[exisiting_product_index] = updated_product;
         }else{
           items.push(updated_product);
         }

         var updated_cart = {
           items:items
         }
         this.cart = updated_cart;
         this.save();

        }

   });

}


module.exports = mongoose.model("User",user);
