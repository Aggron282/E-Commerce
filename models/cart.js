// var path =  require("path");
// var fs = require("fs");
// const p = path.join(path.dirname(process.mainModule.filename),"data","cart.json");;
// const Product = require("./products.js");
//
// const GetItems = (cb) =>{
//   fs.readFile(p,(err,content)=>{
//
//     var cart = {
//       products:[],
//       total_price:0
//     }
//
//     if(!err){
//       cart = JSON.parse(content);
//     }
//     cb(cart);
//   })
// }
//
// class Cart {
//
//   constructor(){
//     this.products = [];
//     this.total_price = 0;
//   }
//
//   static DeleteItem(id,cb){
//
//     Product.findById(id,(item_found)=>{
//
//       GetItems((cart)=>{
//
//             if(cart.products.length <= 0){
//               console.log("No Products in Array")
//               return cb(false);
//             }
//
//             const new_products = cart.products.filter((items) => items.id !== id );
//
//             const new_cart = {...cart};
//
//             new_cart.products = new_products;
//             new_cart.total_price -= item_found.price;
//
//             if(new_cart.products.length == cart.products.length){
//               console.log("Cart item not found")
//               return cb(false);
//             }
//
//             fs.writeFile(p,JSON.stringify(new_cart),()=>{
//                 console.log("Deleted Cart Item");
//                 cb(true);
//             })
//
//           });
//
//         });
//
//   }
//
//   static FindAllItems(cb){
//     GetItems((items)=>{
//       cb(items);
//     })
//   }
//
//   static AddCart(id,price){
//
//     Product.findById(id, (item) =>{
//       GetItems((cart)=>{
//           console.log(cart);
//         var exisiting_product_index = cart.products.findIndex(prod => prod.id == id);
//         var existing_product = cart.products[exisiting_product_index];
//         var updated_product = {
//           title:null,
//           price:null,
//           id:null,
//           qty:null
//         };
//
//         if(existing_product){
//           updated_product = {...existing_product};
//           updated_product.qty = updated_product.qty + 1;
//           updated_product.title = existing_product.title;
//           updated_product.id = existing_product.id;
//           updated_product.price = existing_product.price;
//           cart.products = [...cart.products];
//           cart.products[exisiting_product_index] = updated_product;
//         }else{
//           updated_product = {id:id,qty:1,price:item.price,title:item.title}
//           cart.products = [...cart.products,updated_product]
//         }
//
//         cart.total_price = cart.total_price + price;
//
//         fs.writeFile(p,JSON.stringify(cart),()=>{
//           console.log("Added to Cart");
//         });
//
//     });
//   })
//   }
//
//   }
//
//
//
//
//
// module.exports = Cart;
