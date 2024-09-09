const CURATED_ITEMS_LIMIT = 8;

var redirects_counter = 0;
var page_counter = 0;
var new_catagories = null;

const path = require("path");
const pdf = require('pdfkit');
const bcrypt = require("bcrypt");
const stripe = require("stripe")("sk_test_51OjAfEL9aEOLpUqjCLjitVLvOalLj9CCZEpk9SPkxZnmh2xJZSsB8Fp8mrkAO8lNUaogi51OVptQ9Tc56el67Skg008Rlc9dP2");
const ObjectId = require("mongodb").ObjectId;

const rootDir = require("./../util/path.js");
const fileHelper = require("./../util/file.js");
const text_util = require("./../util/text.js");
const product_util = require("./../util/products.js");
const popup_util = require("./../util/popup.js");

const StatusError = require("./../util/status_error.js");

const admin_controller = require("./admin_controllers.js");
const uni_controller = require("./uni_controller");

const Product = require("./../models/products.js");
const Order = require("../models/orders.js");
const User = require("../models/user.js");
const Review = require("./../models/company_reviews.js");

const CHECKOUTPAGEURL = path.join(rootDir,"views","user","checkout.ejs");
const DETAILPAGEURL = path.join(rootDir,"views","detail.ejs");
const CARTPAGEURL = path.join(rootDir,"views","user","cart.ejs");
const HOMEPAGEURL = path.join(rootDir,"views","user","index.ejs");
const CURATEDPRODUCTSURL = path.join(rootDir,"views","user","curated_products.ejs");


var feedback ={
  items:{
    top_deals:null,
    placeholder:[],
    all:null
  },
  redirect:"/",
  limited_products:null,
  catagories:null,
  cart:null,
  user:null,
  searched_term:"",
  current_catagory:"",
  popup_message:null,
  render:HOMEPAGEURL,
  root:".",
  action:"/user/",
  reviews:[],
  isAdmin:false,
  isAuthenticated:null
};

//----------------------------------------------------------------------------------------
// Get Data Functions
const GetOrders = async(req,res)=>{

  Order.find({"user.userId":req.user._id}).then((orders)=>{
    res.json(orders);
  });

}

const UpdateLocation = (req,res) =>{

  var data = req.body;
  var address = data.address;
  var coords = data.coords;

  User.findById(req.user._id).then((user_)=>{

    user_.location = data;

    var new_user = new User(user_);

    new_user.save();

    res.json({user:new_user,popup:"Updated Location"});
    res.end();

    return;

  }).catch(err => console.log(err));

}

const PostCompanyReview = async (req,res,next) => {

  var body = req.body;
  var name = body.name;
  var title = body.title;
  var profileImg = body.profileImg;
  var description = body.description;

  var review_config = {
    title:name,
    description:description,
    profileImg:profileImg,
    name:body.name
  }

  var new_review = new Review(review_config);

  new_review.save();

  Review.find({}).then((reviews)=>{
    res.json({reviews:reviews});
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

const GetProfile = (req,res)=>{

  if(!req.user){
    res.redirect("/login");
  }
  else{
    res.json(req.user);
  }

}

//----------------------------------------------------------------------------------------
// Change User Data Functions

const EditProfile = (req,res) => {

  var data  = req.body;
  var current_url = req.body.current_url;

  if(!req.user){
    res.redirect("/user/login");
    return;
  }

  var new_password =  data.password.length > 0 ? data.password : req.user.password;

    bcrypt.hash(new_password,12).then((encrypt)=>{

      var file = req.file ? req.file.filename : req.user.profileImg

      const filter = { _id : new ObjectId(req.user._id) };
      const update = {$set:{ email : data.username, name:data.name, password:data.password, profileImg: file} };

      User.findOneAndUpdate(filter,update).then((response)=>{

        req.user = response;

        var new_feedback = {...feedback};

        new_feedback.user = req.user;
        new_feedback.popup_message = "Edited Profile!";
        new_feedback.redirect = feedback.redirect;

        feedback = new_feedback;

        redirects_counter = 0;

        res.redirect(current_url);

      }).catch((err)=>{
        StatusError(next,err,500);
      });

    });

}

//----------------------------------------------------------------------------------------
// Change User Cart Functions

const DeleteCart = (req,res)=>{
  req.user.ClearCart();
}

const DeleteCartItem = async (req,res,next) => {

    var id = req.body._id;

    req.user.deleteProduct(id,(response)=>{
      feedback.popup_message = "Deleted Item From Cart";
      redirects_counter = 0;
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

     feedback.popup_message = "Your Order has been Placed! Check Orders Tab to Confirm"
     redirects_counter = 0;

     res.redirect("/");

  }).catch((err)=>{
    StatusError(next,err,500);
  });

}

const AddToCart = async (req,res,next)=>{

  var id = req.body.productId;
  var id_ = id.replace("/","");
  var product = req.body;
  var quantity = product.quantity;

  if(!req.user || !req.session.isAuthenticated ){
    res.json({error:401});
  }
  else{
    Product.findById(id_).then((data)=>{
        req.user.AddCart(id_,quantity);
        res.json(data);
    }).catch((err)=>{
      StatusError(next,err,500);
    });

  }

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

    var new_feedback = {...feedback};

    new_feedback.items.top_deals = null;
    new_feedback.items.all_products = null;
    new_feedback.user = req.user;
    new_feedback.limited_products = null;
    new_feedback.cart = req.user ? req.user.cart : null;
    new_feedback.catagories = null;

    var redirect = "/checkout";

    new_feedback.isAuthenticated = req.session.isAuthenticated;

    new_feedback.popup_message = new_feedback.redirect == redirect ? new_feedback.popup_message : null;
    new_feedback.redirect = redirect;
    new_feedback.render = CHECKOUTPAGEURL;

    res.render(new_feedback.render,new_feedback);

  });

}

const GetHomePage = async (req,res,next) => {

  Product.find().then(async (all_products) =>{

    var highest_product = null;

    new_catagories = new_catagories ? new_catagories : product_util.OrganizeCatagories(all_products);

    var top_deals = product_util.OrganizeDiscounts(all_products);
    var reviews = await Review.find({});
    var new_feedback = {...feedback};

    new_feedback.items.top_deals = top_deals;
    new_feedback.items.all_products = all_products;
    new_feedback.isAdmin = false;
    new_feedback.user = req.user;
    new_feedback.render = HOMEPAGEURL;
    new_feedback.isAuthenticated = req.session.isAuthenticated;
    new_feedback.cart = req.user ? req.user.cart : null;
    new_feedback.catagories = new_catagories;
    new_feedback.redirect = "/";
    new_feedback.limited_products = null;
    new_feedback.isAdmin = false;
    new_feedback.reviews = reviews;

    var popup = popup_util.CheckPopup(feedback);

    new_feedback.popup_message = popup.message;
    redirects_counter = popup.redirects_counter;

    feedback = new_feedback;

    res.render(new_feedback.render,new_feedback)

 }).catch((err)=>{
    StatusError(next,err,500);
 });

}

const GetProductDetailPage = async (req,res,next) =>{

   var id = req.params._id;

  Product.find().then(async (all_products) =>{

    new_catagories = new_catagories ? new_catagories : product_util.OrganizeCatagories(all_products);

     Product.findById(id).then((product)=>{

       if(!product){
         res.redirect("/")
       }
       else{

         var new_feedback = {...feedback};

         new_feedback.redirect = "/product/"+id;
         new_feedback.items.top_deals = null;
         new_feedback.isAuthenticated = req.session.isAuthenticated;
         new_feedback.items.all_products = all_products;
         new_feedback.user = req.user;
         new_feedback.limited_products = null;
         new_feedback.cart = req.user ? req.user.cart : null;
         new_feedback.catagories = new_catagories;
         new_feedback.render = DETAILPAGEURL;
         new_feedback.item = product;

         var popup = popup_util.CheckPopup(new_feedback);

         new_feedback.popup_message = popup.message;

         redirects_counter = popup.redirects_counter;

         res.render(new_feedback.render,new_feedback);

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

Product.find().then(async (all_products) =>{

     new_catagories = new_catagories ? new_catagories : product_util.OrganizeCatagories(all_products);

     var new_feedback = {...feedback};

     new_feedback.items.top_deals = null;
     new_feedback.items.all_products = all_products;
     new_feedback.user = req.user;
     new_feedback.isAuthenticated = req.session.isAuthenticated;
     new_feedback.redirect = "/cart";
     new_feedback.limited_products = null;
     new_feedback.cart = req.user ? req.user.cart : null;
     new_feedback.catagories = new_catagories;
     new_feedback.render =  CARTPAGEURL;
     new_feedback.session_id = session;
     new_feedback.total_price = total_price;
     new_feedback.cart.items = items ? items : [];

     var popup = popup_util.CheckPopup(new_feedback);

     new_feedback.popup_message = popup.message;

     redirects_counter = popup.redirects_counter;

     feedback = new_feedback;


    res.render(new_feedback.render,new_feedback);

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
    var updated_catagories = product_util.catagoryMatch(new_catagories,catagory,counter);
    var cart;

    new_catagories = new_catagories ? new_catagories : product_util.OrganizeCatagories(all_products);

    if(req.user){
      cart = req.user.cart;
    }else{
      cart = null
    }

    res.json(updated_catagories);

  });

}

module.exports.UpdateLocation = UpdateLocation;
module.exports.DeleteCartItem = DeleteCartItem;
module.exports.GetCartPage = GetCartPage;
module.exports.GetOrders = GetOrders;
module.exports.GetProfile = GetProfile;
module.exports.EditProfile = EditProfile;
module.exports.ToggleCatagories = ToggleCatagories;
module.exports.DeleteCart = DeleteCart;
module.exports.PostCompanyReview = PostCompanyReview;
module.exports.GetCurrentCart = GetCurrentCart;
module.exports.GetHomePage = GetHomePage;
module.exports.AddToCart = AddToCart;
module.exports.AddOrder = AddOrder;

module.exports.GetProductDetailPage = GetProductDetailPage;
