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

user.methods.AddCart = function(id){

  Product.findById(id).then((item) =>{

    if (this.cart.items.length <= 0) {
      this.cart = {
        items:[{
          prodId:item._id,
          data:item,
          quantity:1
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
           quantity:item.quantity
         };


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
         console.log(this);
         this.cart = updated_cart;
         this.save();

        }

   });
   
}

user.methods.deleteProduct = function(id,cb){

    var new_items = [];

    for(var i =0; i <this.cart.items.length; i++){

      if(id != this.cart.items[i].prodId ){
        new_items.push(this.cart.items[i]);
      }

    }

    var new_cart = {
      items:new_items,
    };

    this.cart = new_cart;

    this.save();

    cb("Delete One Product");

}

module.exports = mongoose.model("User",user);
