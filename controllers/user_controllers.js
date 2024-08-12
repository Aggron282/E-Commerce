const path = require("path");
const pdf = require('pdfkit');
const stripe = require("stripe")("sk_test_51OjAfEL9aEOLpUqjCLjitVLvOalLj9CCZEpk9SPkxZnmh2xJZSsB8Fp8mrkAO8lNUaogi51OVptQ9Tc56el67Skg008Rlc9dP2");
const rootDir = require("./../util/path.js");
const fileHelper = require("./../util/file.js");
const text_util = require("./../util/text.js");
const product_util = require("./../util/products.js");

const ObjectId = require("mongodb").ObjectId;

const StatusError = require("./../util/status_error.js");

const Product = require("./../models/products.js");
const Order = require("../models/orders.js");
const User = require("../models/user.js");

const PlaceholderImages = require("./../data/items_placeholder_other_rated.js");
const Reviews = require("./../data/reviews.js");

var default_catagories = [
    {
      catagory:"Sportswear",
      items:[],
      counter:0,
    },
    {
      catagory:"Fashion",
      items:[],
      counter:0,
    },
    {
      catagory:"Electronics",
      items:[],
      counter:0
    },
    {
      catagory:"Home",
      items:[],
      counter:0
    },
    {
      catagory:"Cookware",
      items:[],
      counter:0
    }
]



//----------------------------------------------------------------------------------------
// Get Data Functions
const GetOrders = async(req,res)=>{

  Order.find({"user.userId":req.user._id}).then((orders)=>{
    res.json(orders);
  });

}

const GetCurrentCart = (req,res,next)=>{

    if(req.user){

      if(req.user.cart){
        res.json(req.user.cart);
      }else{
        res.json({error:"No Cart"})
      }

    }
    else{
      res.json({error:"No User"})
    }

}

const GetCatagories = (req,res,next) => {

   Product.find().then( (all_products) =>{
    var new_catagories = product_util.OrganizeCatagories(default_catagories,all_products);
    res.json(new_catagories);
  });

}

const GetProducts = async (req,res,next) =>{

  var products = Product.find().then((data)=>{
    res.json(data);
  }).catch((err)=>{
    StatusError(next,err,500);
  });

}

const GetProfile = (req,res)=>{

  if(!req.user){
    res.redirect("/login");
  }
  else{
    res.json(req.user);
  }

}

const GetSearchResults = (req,res,next) => {

  var input = req.body.input.toLowerCase();

  Product.find({}).then((all_products)=>{

     var similar_products = [];

     for(var i = 0; i < all_products.length; i ++){

      if(all_products[i].title.toLowerCase().includes(input) ){
         similar_products.push(all_products[i]);
       }

     }

     res.json(similar_products);

  });

}

//----------------------------------------------------------------------------------------
// Change User Data Functions

const EditProfile = (req,res) => {

  var data  = req.body;

  if(!req.user){
    res.redirect("/user/login");
    return;
  }

  const filter = { _id : new ObjectId(req.user._id) };
  const update = {$set:{ email : data.username, name:data.name, password:data.password } };

  User.findOneAndUpdate(filter,update).then((response)=>{
      req.user = response;
  });

}

//----------------------------------------------------------------------------------------
// Change User Cart Functions

const DeleteCart= (req,res)=>{
  req.user.ClearCart();
}

const DeleteCartItem = async (req,res,next) => {

    var id = req.body._id;

    req.user.deleteProduct(id,(response)=>{
      res.redirect("/cart");
    });

}

const AddOrder = async(req,res,next) =>{

  var user = req.user;

  req.user.execPopulate("cart.items.prodId").then((user)=>{

    const product_data = [...user.cart.items];

    const user_data = {
      userId: user._id,
      name:user.name
    }

    const new_order = new Order({
        products:product_data,
        user:user_data
      });

     new_order.save();

     req.user.ClearCart();

     res.redirect("/");

  }).catch((err)=>{
    StatusError(next,err,500);
  });

}

const AddToCart = async (req,res,next)=>{

  var id = req.body.productId;
  var id_ = id.replace("/","");
  var product = req.body;

  Product.findById(id_).then((data)=>{
      req.user.AddCart(data);
      res.json(data);
  }).catch((err)=>{
    StatusError(next,err,500);
  });

}

//----------------------------------------------------------------------------------------
//--- Page Render Functions

const GetCheckoutPage = async (req,res) =>{

  var user = req.user;
  var item;
  var total_price = 0;

  if(req.user.cart.items.length > 0){

    for(var i =0; i <req.user.cart.items.length; i ++ ){
      item = req.user.cart.items[i];
      total_price += item.data.price  * item.quantity;
    }

  }

   stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: req.user.cart.items.map((p)=>{
        return {
          quantity: p.quantity,
          catagories:default_catagories,
          price_data:{
            unit_amount:p.data.price * 100,
            product_data:{
              name: p.data.title,
              description:p.data.description
            },
            cart:req.user.cart,
            currency:"usd",
        }
      }

    }),
    mode:"payment",
    success_url:req.protocol + "://" + req.get("host") + "/checkout/success",
    cancel_url:req.protocol + "://" + req.get("host") + "/checkout/cancel",
  }).then((session)=>{

    res.render(path.join(rootDir,"views","user","checkout.ejs"),{
      items:user.cart.items,
      catagories: default_catagories,
      total_price:total_price,
      action:"/user/profile/edit",
      sessionId: session.id,
      isAuthenticated:req.session.isAuthenticated
    });

  });

}

const GetHomePage = async (req,res,next) => {

  Product.find().then(async (all_products) =>{

    var top_deals = [];
    var highest_product = null;
    var new_catagories =  await product_util.OrganizeCatagories(default_catagories,all_products);

    top_deals = [...all_products];

    var cart;

    if(req.user){
      cart = req.user.cart;
    }
    else{
      cart = null
    }

    res.render(path.join(rootDir,"views","user","index.ejs"),{
      items:{
        top_deals:top_deals,
        highest_deal: highest_product,
        placeholder:PlaceholderImages,
      },
      catagories:new_catagories,
      cart:cart,
      root:".",
      action:"/user/profile/edit",
      reviews:Reviews,
      isAuthenticated:req.session.isAuthenticated
    })

 }).catch((err)=>{
   StatusError(next,err,500);
 });

}

const GetProfilePage = (req,res)=>{

  if(!req.user){
    res.redirect("/login");
    return;
  }

  res.render(path.join(rootDir,"views","user","profile.ejs"),{
    user:req.user,
    isAuthenticated:true
  });

}

const GetProductDetailPage = async (req,res,next) =>{

   var id = req.params._id;

  Product.find().then(async (all_products) =>{

     var new_catagories = product_util.OrganizeCatagories(default_catagories,all_products);

     Product.findById(id).then((product)=>{

       if(!product){
         res.redirect("/")
       }
       else{
         res.render(path.join(rootDir,"views","user","detail.ejs"),{
           item:product,
           catagories:new_catagories,
           isAdmin:false,
           root:"..",
           cart:req.user.cart,
           isAuthenticated:req.session.isAuthenticated,
           action:"/user/profile/edit"
         });

       }

     }).catch((err)=>{
      StatusError(next,err,500);
     });

   })

 }

const GetCartPage = async (req,res) =>{

    var user = req.user;
    var total_price = 0;
    var cart = null;
    var items = null;
    var session = null;

    if(req.user.cart){

      cart = req.user.cart;

      var existing_items = [];

      if(cart.items.length > 0){

        items  = cart.items;

        for(var i =0; i <items.length; i ++ ){

          var item = req.user.cart.items[i];
          var found = false

          if(existing_items.length <= 0){
            existing_items.push(item);
          }
          else{

                for(var k =0; k < existing_items.length; k ++ )
                {

                    if(existing_items[k].data.title == item.data.title){
                      existing_items[k].data.quantity += 1;
                      found = true;
                    }

                }

                if(!found){
                  existing_items.push(item);
                }

          }

          total_price += item.data.price  * item.quantity;

        }

        var line_items =  req.user.cart.items.map((p)=>{
            return {
              quantity: p.quantity,
              price_data:{
                unit_amount:p.data.price * 100,
                product_data:{
                  name: p.data.title,
                  description:p.data.description
                },
                currency:"usd",
            }
          }

        })

        var config = {
         payment_method_types: ["card"],
         line_items:line_items,
         mode:"payment",
         success_url:req.protocol + "://" + req.get("host") + "/checkout/success",
         cancel_url:req.protocol + "://" + req.get("host") + "/checkout/cancel"
       };

        var session_data =  await stripe.checkout.sessions.create(config);

        session = session_data.id;

      }

}

  res.render(path.join(rootDir,"views","user","cart.ejs"),{
    items:existing_items,
    cart:cart,
    root:"..",
    catagories:default_catagories,
    total_price:total_price,
    action:"/user/profile/edit",
    session_id:session,
    isAuthenticated:req.session.isAuthenticated
  })

}

//----------------------------------------------------------------------------------------
// Product Filter Functions

const ToggleCatagories = (req,res,next) => {

  Product.find().then((all_products) => {

    var data = JSON.parse(req.body.body);
    var counter = parseInt(data.counter);
    var catagory = data.catagory;
    var view_per_toggle = 4;

    var new_catagories = product_util.OrganizeCatagories(default_catagories,all_products);
    var updated_catagories = product_util.catagoryMatch(new_catagories,catagory,counter);
    var cart;

    if(req.user){
      cart = req.user.cart;
    }else{
      cart = null
    }

    res.json(updated_catagories);

  })

}


module.exports.DeleteCartItem = DeleteCartItem;
module.exports.GetCartPage = GetCartPage;
module.exports.GetOrders = GetOrders;
module.exports.GetProfile = GetProfile;
module.exports.EditProfile = EditProfile;
module.exports.GetCatagories = GetCatagories;
module.exports.ToggleCatagories = ToggleCatagories;
module.exports.GetSearchResults = GetSearchResults;
module.exports.DeleteCart = DeleteCart;
module.exports.GetCurrentCart = GetCurrentCart;
module.exports.GetHomePage = GetHomePage;
module.exports.GetProducts = GetProducts;
module.exports.AddToCart = AddToCart;
module.exports.AddOrder = AddOrder;
module.exports.GetProductDetailPage = GetProductDetailPage;
