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
const location = require("./../util/location.js");
const popup_util = require("./../util/popup.js");

const StatusError = require("./../util/status_error.js");

const admin_controller = require("./admin_controllers.js");
const uni_controller = require("./uni_controller");

const Product = require("./../models/products.js");
const Order = require("../models/orders.js");
const User = require("../models/user.js");
const Review = require("./../models/company_reviews.js");
const CURATEDPRODUCTSURL = path.join(rootDir,"views","user","curated_products.ejs");


var feedback ={
  items:{
    top_deals:null,
    placeholder:[],
    all:null
  },
  redirect:CURATEDPRODUCTSURL,
  limited_products:null,
  catagories:null,
  cart:null,
  user:null,
  searched_term:"",
  current_catagory:"",
  popup_message:null,
  render:"/",
  root:".",
  action:"/user/",
  reviews:[],
  isAdmin:false,
  isAuthenticated:null
};

function ReturnIsAdmin(req){

  var isAdmin = req.params.isAdmin  == "true"? true : false;

  if(isAdmin){

    if(!req.admin){
      return  false;
    }
    else{
      return true;
    }

  }else{
    return false;
  }

}

const GetReviews = (req,res)=>{

  Review.find({}).then((reviews)=>{
    res.json({reviews:reviews});
  })

}

const GetCatagories = (req,res,next) => {

   Product.find().then( (all_products) =>{

    new_catagories = new_catagories ? new_catagories : product_util.OrganizeCatagories(all_products);

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


function GetPageData(counter,products){

  var starting_counter = CURATED_ITEMS_LIMIT * counter;

  var limited_products = [];

  if(starting_counter <= 0){
    starting_counter = 0;
  }

  for(var k = 0; k < CURATED_ITEMS_LIMIT; k++ ){

    if(starting_counter + k < products.length){
      limited_products.push(products[starting_counter + k]);
    }else{
      break;
    }

  }

    return limited_products

}

const ConvertLocation = async (req,res) => {

  var address = req.body.address;
  var location_data = await location.ConvertLocation(address);

  res.json({location:location_data});

}

const ReverseConvertLocation = async (req,res) => {

  var coords = req.body;

  var location_data = await location.ReverseConvertLocation(coords);

  if(!location_data){
    res.render(false);
    return;
  }

  var data = location_data;

  var formatted_address = {
    zip:data.zipcode,
    stateAbr:data.state_abbr,
    city:data.city,
    state:data.state
  }

  var coords = {
    latitude:data.latitude,
    longitude:data.longitude
  }

   res.json({address:formatted_address,coords:coords});
   res.end();

}

async function OutputSearchResults(req,product,page_counter,all_products){

   new_catagories = new_catagories ? new_catagories : product_util.OrganizeCatagories(all_products);

   var similar_products = await product_util.FindSimilarProducts(product,all_products);
   var page_length = Math.floor(similar_products.length / CURATED_ITEMS_LIMIT);
   var limited_products = uni_controller.GetPageData(page_counter,similar_products);
   var new_feedback = {...feedback};

   new_feedback.items.top_deals = null;
   new_feedback.items.all_products = all_products;
   new_feedback.user = req.user;
   new_feedback.limited_products = limited_products;
   new_feedback.cart = req.user ? req.user.cart : null;
   new_feedback.catagories = new_catagories;
   new_feedback.page_length = page_length;
   new_feedback.page_counter = page_counter ;
   new_feedback.action = "/user/profile/edit";
   new_feedback.current_catagory = "";
   new_feedback.searched_term = product;
   new_feedback.isAdmin = ReturnIsAdmin(req);
   new_feedback.render = CURATEDPRODUCTSURL;
   new_feedback.isAuthenticatedAdmin = req.session.isAuthenticatedAdmin;
   new_feedback.popup_message = popup_util.CheckPopup(new_feedback);

   return new_feedback;
}

const GetSearchResults = async (req,res,next) => {

  var product = req.params.product;
  var page_counter = parseInt(req.params.page_counter) - 1;
  var adminI = req.params.isAdmin;

  if(!adminI ){

    Product.find({}).then(async (all_products)=>{

      var new_feedback = await OutputSearchResults(req,product,page_counter,all_products);
      res.render(new_feedback.render, new_feedback);

      });

  }else if(req.admin){
    var new_feedback = await OutputSearchResults(req,product,page_counter,req.admin.products);
    res.render(new_feedback.render, new_feedback);
  }else{
    res.redirect("/admin/login");
  }

}

async function OutputCatagorySearch(req,catagory,page_counter,all_products){

  new_catagories = new_catagories ? new_catagories : product_util.OrganizeCatagories(all_products);

  var products_in_catagory = await product_util.FindProductsFromCatagory(catagory,new_catagories);
  var page_length = Math.floor(products_in_catagory.length / CURATED_ITEMS_LIMIT);
  var limited_products = uni_controller.GetPageData(page_counter,products_in_catagory);
  var cart = req.user ? req.user.cart : null;
  var new_feedback = {...feedback};

  new_feedback.items.top_deals = null;
  new_feedback.items.all_products = all_products;
  new_feedback.user = req.user;
  new_feedback.limited_products = limited_products;
  new_feedback.cart = req.user ? req.user.cart : null;
  new_feedback.catagories = new_catagories;
  new_feedback.popup_message = null;
  new_feedback.isAuthenticatedAdmin = req.session.isAuthenticatedAdmin;
  new_feedback.page_length = page_length;
  new_feedback.page_counter = page_counter;
  new_feedback.action = "/user/profile/edit";
  new_feedback.current_catagory = catagory;
  new_feedback.catagory_input = catagory;
  new_feedback.searched_term = new_feedback.searched_term;
  new_feedback.render = CURATEDPRODUCTSURL;
  new_feedback.isAdmin = ReturnIsAdmin(req);

  return new_feedback;

}

const GetCatagoryResults = async (req,res) => {

  var catagory = req.params.catagory ? req.params.catagory : req.body.catagory;
  var page_counter = parseInt(req.params.page_counter);
  var adminI = req.params.isAdmin;

  if(!adminI){

    Product.find({}).then(async (all_products)=>{

      var new_feedback = await OutputCatagorySearch(req,catagory,page_counter,all_products);
      res.render(new_feedback.render, new_feedback);

    });

  }else{
    var new_feedback = await OutputCatagorySearch(req,catagory,page_counter,req.admin.products);
    res.render(new_feedback.render, new_feedback);
  }

}


module.exports.ReverseConvertLocation = ReverseConvertLocation;
module.exports.ConvertLocation = ConvertLocation;
module.exports.GetPageData = GetPageData;
module.exports.GetProducts = GetProducts;
module.exports.GetCatagories = GetCatagories;
module.exports.GetCatagoryResults = GetCatagoryResults;
module.exports.GetSearchResults = GetSearchResults;
module.exports.GetReviews = GetReviews;
