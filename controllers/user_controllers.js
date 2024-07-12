var path = require("path");
const pdf = require('pdfkit');
const stripe = require("stripe")("sk_test_51OjAfEL9aEOLpUqjCLjitVLvOalLj9CCZEpk9SPkxZnmh2xJZSsB8Fp8mrkAO8lNUaogi51OVptQ9Tc56el67Skg008Rlc9dP2");

const Product = require("./../models/products.js");
const Cart = require("../models/cart.js");
const Order = require("../models/orders.js");
const User = require("../models/user.js");
const PlaceholderImages = require("./../data/items_placeholder_other_rated.js");
const Reviews = require("./../data/reviews.js");

const fileHelper = require("./../util/file.js");
var rootDir = require("./../util/path.js");
const StatusError = require("./../util/status_error.js");


const ObjectId = require("mongodb").ObjectId;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

function RedirectIfNotAuthenticated(req,res){

  var isAuthenticated = false;

  if(req.session){

    if(req.session.isAuthenticated){
      isAuthenticated = req.session.isAuthenticated;
    }

  }

  if(!isAuthenticated){
    res.redirect("/login");
  }

}

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
    },
]

async function FindHighestDiscount(products){

  var top_deal = 0;
  var highest_product;

  for(var i =0; i <products.length;i++){

    if(products[i].discount > top_deal){

        top_deal = products[i].discount;
        highest_product = products[i];

      }

    }

  return highest_product;

}

async function GetItemsInCatagory(catagory){

  Product.find({catagory:catagory}).then((products)=>{

    for(var i =0; i < default_catagories.length; i ++){

      if(catagory == default_catagories[i].catagory){
        default_catagories[i].items = products;
        break;
      }

    }

  })

}


function OrganizeCatagories(products){

  var new_catagories = [...default_catagories];

  for(var i =0; i < new_catagories.length; i++){
    const result = products.filter((product) => product.catagory ==  new_catagories[i].catagory);
    new_catagories[i].items = result
  }

  return new_catagories;

}

function OrganizeDiscounts(products){

  var new_products = {...products};

  for(var i =0; i <products.length;i++){

    if(products[i].discount > 20){
      new_products.push(products[i]);
    }

  }

  return  new_products;

}

const DeleteCartItem = async (req,res,next) => {

    var id = req.body._id;

    req.user.deleteProduct(id).then((response)=>{
      res.redirect("/cart");
    }).catch((err)=>{
      StatusError(next,err,500);
    });

}

const GetAdminPage = (req,res) => {

  if(!req.session.isLoggedIn){
    res.redirect("/login");
  }
  else
  {
    res.render(path.join(rootDir,"views","user","user_admin.ejs"),{
      isAuthenticated:req.session.isAuthenticated
    });
  }

}

const GetOrders = async(req,res)=>{

  Order.find({"user.userId":req.user._id}).then((orders)=>{
    res.json(orders);
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

    const new_order = new Order(
      {
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

 const GetProductDetail = async (req,res,next) =>{

   var id = req.params._id;

   RedirectIfNotAuthenticated(req,res);

   Product.findById(id).then((product)=>{

     if(!product){
       res.redirect("/")
     }
     else{

       res.render(path.join(rootDir,"views","user","detail.ejs"),{
         item:product,
         catagories:null,
         cart:req.user.cart,
         isAuthenticated:req.session.isAuthenticated
       });

     }

   }).catch((err)=>{
    StatusError(next,err,500);
   });

 }

const AddToCart = async (req,res,next)=>{

  var id = req.body.id;
  var id_ = id.replace("/","");
  var product = req.body;

  Product.findById(id_).then((data)=>{
    req.user.AddCart(data);
    res.redirect(`/product/${id_}`);
  }).catch((err)=>{
    StatusError(next,err,500);
  });

}

const GetCatagories = (req,res,next) => {

   Product.find().then( (all_products) =>{
    var new_catagories = OrganizeCatagories(all_products);
    res.json(new_catagories);
  });

}

function catagoryMatch(catagories, catagory_needed,counter) {

  var catagories_ = [...catagories];
  var current;

  for(i = 0; i < catagories_.length; i ++){

    if(catagories_[i].catagory == catagory_needed){

      catagories_[i].counter +=  counter * 4;

      if(catagories_[i].counter < 0){
        catagories_[i].counter = 0;

      }

      if(catagories_[i].counter >= Math.floor(catagories_[i].items.length / 3) ){
        catagories_[i].counter = 0;

      }
        current = catagories_[i];

        return {all:catagories_,current:current};

    }

  }

}

const ToggleCatagories = (req,res,next) => {

  Product.find().then((all_products) => {

    var data = JSON.parse(req.body.body);
    var counter = parseInt(data.counter);
    var catagory = data.catagory;
    var view_per_toggle = 4;

    var new_catagories = OrganizeCatagories(all_products);
    var updated_catagories = catagoryMatch(new_catagories,catagory,counter);
    var cart;

    if(req.user){
      cart = req.user.cart;
    }else{
      cart = null
    }
    res.json(updated_catagories);

  })
  //  Product.find().then( (all_products) =>{
  //    console.log(all_products.length);
  //   var new_catagories = OrganizeCatagories(all_products);
  //   console.log(new_catagories);
  // });

}


const GetHomePage = async (req,res,next) => {

  Product.find().then(async (all_products) =>{

    var top_deals = [];
    var highest_product = null;
    var new_catagories =  OrganizeCatagories(all_products);
    // if(all_products.length > 5){
    //
    //   highest_product = FindHighestDiscount(all_products);
    //
    //   top_deals.push(highest_product);
    //
    //   top_deals = OrganizeDiscounts(top_deals);
    //
    // }else{
    top_deals = [...all_products];

    var cart;

    if(req.user){
      cart = req.user.cart;
    }else{
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
      reviews:Reviews,
      isAuthenticated:req.session.isAuthenticated
    })

 }).catch((err)=>{
   StatusError(next,err,500);
 });

}

const GetProducts = async (req,res,next) =>{

  var products = Product.find().then((data)=>{
    res.json(data);
  }).catch((err)=>{
    StatusError(next,err,500);
  });

}

const DeleteCart= (req,res)=>{
  req.user.ClearCart();
}

const GetCartPage = async (req,res) =>{

  var user = req.user;
  var total_price = 0;
  var cart = null;
  var items = null;

  RedirectIfNotAuthenticated(req,res);

  if(req.user){

    if(req.user.cart){

      cart = req.user.cart;

      if(cart.items.length > 0){

        items  = cart.items;

        for(var i =0; i <req.user.cart.items.length; i ++ ){

          var item = req.user.cart.items[i];
          total_price += item.data.price  * item.quantity;

        }

      }

    }

}

  res.render(path.join(rootDir,"views","user","cart.ejs"),{
    items:items,
    cart:cart,
    catagories:default_catagories,
    total_price:total_price,
    isAuthenticated:req.session.isAuthenticated
  })

}

const GetCheckoutPage = async (req,res) =>{
  var user = req.user;
  var item;

//  console.log(user.cart.items);
RedirectIfNotAuthenticated(req,res);

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
      sessionId: session.id,
      isAuthenticated:req.session.isAuthenticated
    })

  });

}

module.exports.DeleteCartItem = DeleteCartItem;
module.exports.GetCartPage = GetCartPage;
module.exports.GetAdminPage = GetAdminPage;
module.exports.GetCheckoutPage = GetCheckoutPage;
module.exports.GetOrders = GetOrders;
module.exports.GetCatagories = GetCatagories;
module.exports.ToggleCatagories = ToggleCatagories;
module.exports.GetSearchResults = GetSearchResults;

module.exports.DeleteCart = DeleteCart;
module.exports.GetHomePage = GetHomePage;
module.exports.GetProducts = GetProducts;
module.exports.AddToCart = AddToCart;
module.exports.AddOrder = AddOrder;
module.exports.GetProductDetail = GetProductDetail;
