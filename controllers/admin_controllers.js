let totalProducts;
var redirects_counter = 0;
var page_counter = 0;
var new_catagories = null;
var multer = require("multer");
const upload = multer({dest:"images/"});
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const PDFDocument = require("pdfkit");
const ObjectId = require("mongodb").ObjectId;

const StatusError = require("./../util/status_error.js");

const rootDir = require("./../util/path.js");
const product_util = require("./../util/products.js");

const Product = require("./../models/products.js");
const Order = require("./../models/orders.js");
const Admin = require("./../models/admin.js")

const HOMEPAGEURL = path.join(rootDir,"views","admin","admin.ejs");
const DETAILPAGEURL = path.join(rootDir,"views","detail.ejs");
const {validationResult} = require("express-validator");

var feedback = {
  product:null,
  root:"",
  user:null,
  redirect:"",
  isAdmin:true,
  isAuthenticatedAdmin:false,
}

const HardResetProducts = (req,res) => {

  if(!req.admin){
    res.json(false);
    return;
  }

  Product.deleteMany().then((delete_response)=>{

    if(!delete_response){
      res.json(false)
      return;
    }

    var products = req.admin.products.map((product_)=>{
      delete product_._id;
      return product_;
    });

    Product.insertMany(products).then((insert_response)=>{
      res.json({products:products});
    });

  });

}
//--------------------------------------------------------------------------------
// Get Data Functions
const GetAdminData = (req,res)=>{
  res.json(req.admin);
}

const GetProductsData = async (req,res,next) =>{
  res.json(req.admin.products);
}

const GetOneProductByParams = async (req,res,next) =>{

  var id = req.params.id;

  Product.findById(id).then((data)=>{

      var new_product = data;

      return res.json(new_product);

    }).catch((err)=>{
      StatusError(next,err,500);
    });

}

const GetOneProduct = (req,res,next) => {

  var id = req.body._id;
  var didFindProduct = false;

  if(!req.admin){
    res.status(403).redirect("/admin/login");
    return;
  }

  var admin_products = req.admin.products

  for(var i =0; i < admin_products.length; i++){

    if(JSON.stringify(id) == JSON.stringify(admin_products[i]._id)){
        didFindProduct = true;
        break;
     }

  }

  if(didFindProduct){
    res.json(admin_products[i]);
  }
  else{
    res.json(false);
  }

}

//--------------------------------------------------------------------------------
// Change Admin Profile
const EditAdmin = (req,res) => {

  var data  = req.body;

  console.log(data);

  if(!req.admin){
    res.status(403).redirect("/admin/login");
    return;
  }

  const filter_by_id = { _id : req.admin._id };

  var profile_img = null;

  if(req.file){
    profile_img = req.file.filename ? req.file.filename : null;
  }

  var new_password = data.password.length > 0 ? data.password : req.admin.password;

  bcrypt.hash(new_password,12).then((encrypt)=>{

      const update_profile_values = {$set:{ username : data.username, name:data.name, password:encrypt, profileImg:profile_img} };


      Admin.updateOne(filter_by_id,update_profile_values).then(async (update_response)=>{
        const new_admin = await Admin.findOne(filter_by_id);
        req.session.admin = new_admin;
        res.status(200).json(true);
      }).catch((err)=>{
        console.log(err);
        res.status(500).json(false);
      });

  });

}

//--------------------------------------------------------------------------------
//Update Location

const UpdateLocation = (req,res) =>{

  var data = req.body;
  var address = data.address;
  var coords = data.coords;

  redirects_counter = 0;

  Admin.findById(req.admin._id).then((admin_found)=>{

    admin_found.location = data;

    var new_admin = new Admin(admin_found);

    new_admin.save();
    req.admin = new_admin;
    res.status(200).json({user:new_admin});

  }).catch((err) => {
    console.log(err)
    res.status(500).json(false);
  });

}

//--------------------------------------------------------------------------------
// Get URL Pages
const GetMainPage = async (req,res,next) =>{

   if(!req.admin){
     res.redirect("/admin/login");
     return;
   }

   new_catagories = new_catagories ? new_catagories : product_util.OrganizeCatagories(req.admin.products);

   var new_feedback = {...feedback};

   new_feedback.user = req.user;
   new_feedback.products = req.admin.products,
   new_feedback.action = "/admin/profile/edit";
   new_feedback.totalProducts = totalProducts
   new_feedback.isAuthenticatedAdmin = req.session.isAuthenticatedAdmin;
   new_feedback.catagories = new_catagories;

   feedback = new_feedback;

   res.render(HOMEPAGEURL,feedback);

}

const GetProductDetailPage = async (req,res,next) =>{

    var id = req.params._id;

    if(!id || id.length < 10){
        res.status(403).redirect("/admin")
        return;
    }

    Product.findById(id).then(async (found_product)=>{

      if(!found_product){
        res.status(403).redirect("/admin")
      }
      else{

        new_catagories = new_catagories ? new_catagories : product_util.OrganizeCatagories(req.admin.products);

        var new_feedback = {...feedback}

        new_feedback.action = "/product/edit/"+id;
        new_feedback.item = found_product;
        new_feedback.redirect = "/product/edit/"+id;
        new_feedback.isAdmin = true;
        new_feedback.catagories = new_catagories;
        new_feedback.isAuthenticatedAdmin = req.session.isAuthenticatedAdmin;

        res.render(DETAILPAGEURL,new_feedback);

      }

    }).catch((err)=>{
      console.log(err);
      res.status(500).json(false);
    });

}

const GetOrderPage =(req,res,next)=>{

  Order.find({"user.userId":req.user._id}).then((orders)=>{
    res.render(path.join(rootDir,"views","layouts","orders.ejs"),{orders:orders});
  }).catch((err)=>{
    console.log(err);
    res.status(500).json(false);
  });

}

//--------------------------------------------------------------------------------
// Admin Products Changes
const DeleteOneProduct =  (req,res,next) =>{

  var id = req.body._id;
  DeleteProduct(req,res,id);

}

async function DeleteProduct(req,res,id){

    const new_products = req.admin.products.filter((product_) => {
      return JSON.stringify(id) != JSON.stringify(product_._id)
    });

    var new_admin = {...req.admin};

    new_admin.products = new_products;

    var isFound = await Product.findOne({_id:id});

    if(isFound){
      await Product.deleteOne({_id:id});
    }else{
      console.log("Could not find Product");
    }

    var update_query = {$set: {'products': new_products}};

    Admin.findByIdAndUpdate({_id:req.admin._id},update_query,(update_response)=>{
      req.admin = new_admin;
      res.status(200).json(update_response);
    }).catch((err)=>{
      res.status(500).json(false);
    });

}

const DeleteOneProductByParams = (req,res,next) =>{

  var id = req.params.id;
  DeleteProduct(req,res,id);

}

const EditOneProduct = async (req,res,next) =>{

  var body = req.body;
  var products = [...req.admin.products];

  var found_product = await Product.findOne({_id:new ObjectId(body._id)});

  var product_config = {...found_product._doc};

  var product_thumbnail = product_config.thumbnail;

  if(req.file && req.file.filename){
     product_thumbnail = req.file.filename;
  }

  product_config.title = body.title;
  product_config.thumbnail = product_thumbnail;
  product_config.description = body.description;
  product_config.price = body.price;
  product_config.banner = body.banner;
  product_config.catagory = body.catagory;
  product_config.quantity = body.quantity;
  product_config.userId = req.admin._id;
  product_config.discount = body.discount;

  var new_products = products.map((product_)=>{

    if(JSON.stringify(product_._id) == JSON.stringify(product_config._id)){
      return product_ = product_config;
    }

    return product_;

  });

  Product.findOneAndReplace({_id:product_config._id},product_config).then((replace_response)=>{

    const filter_by_id = { _id : new ObjectId(req.admin._id) };
    const update_products = {$set:{ products : new_products}};

    Admin.findOneAndUpdate(filter_by_id,update_products,{new: true,useFindAndModify:false}).then((err,doc)=>{

      var new_admin = {...req.admin};

      new_admin.products = new_products;

      req.admin = new_admin;

      res.redirect(req.url);

    });

  });

}

const AddProduct = async (req,res,nect) => {

  var errors = validationResult(req);
  var body  =   req.body;
  var filename  = "";
  console.log(req.file)
  feedback.validationErrors = errors.array();

  if(!errors.isEmpty()){
    res.status(500).json(false);
    return;
  }

  // if(!req.file){
  //   res.status(500).json(false);
  //   return;
  // }

  if(req.file){
    filename = req.file.filename ? req.file.filename : "";
  }

  var product_config = {
    title:body.title,
    quantity:body.quantity,
    description:body.description,
    price:body.price,
    discount:body.discount,
    catagory:body.catagory,
    banner:body.banner,
    thumbnail:filename,
    userId:req.admin._id
  }

  var new_product = new Product(product_config);

  var new_admin = {...req.admin._doc};

  var new_products = new_admin.products;

  const filter_by_id = { _id : new ObjectId(new_admin._id) };
  const update_products = {$set:{ products : new_products}};

  new_product.save();

  new_admin.products.push(new_product);

  Admin.findOneAndUpdate(filter_by_id,update_products,{new: true,useFindAndModify:false}).then((err,doc)=>{
    res.status(200).json(true);
    return;
  }).catch((err)=>{
    res.status(500).json(false);
  })

}

//--------------------------------------------------------------------------------
// Get Order Data
const DownloadOrder = (req,res,next) =>{

  const order_id = req.params.orderId;

  Order.findById(order_id).then((order)=>{

    var user_id = order.user.userId ;
    var _id = req.user._id;

    user_id = user_id.toString()
    _id = _id.toString()

    if(user_id == _id){

      const file_name = "Invoice-"+ order_id+".pdf";

      var pdfDoc = new PDFDocument();

      res.setHeader("Content-Type","application/pdf");

      var pdf_path = path.join(rootDir,"data","invoices",file_name);

      pdfDoc.pipe(fs.createWriteStream(pdf_path));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(16).text(`Invoice for ${order.user.name}`);
      pdfDoc.fontSize(10).text("---------------------------------------------------------------------------------------------------------------------------------");
      pdfDoc.text("\n \n")

      var total_price = 0;

      order.products.forEach((product)=>{
        total_price+=product.prodId.price;
        pdfDoc.text(product.prodId.title + " ------ " + "$" + product.prodId.price).fontSize(20);
        pdfDoc.text( " qty:" + product.quantity );
        pdfDoc.text("------------------------------------------------------")
      });

      pdfDoc.fontSize(20).text("Total: $"+total_price+".99");

      var path_ = path.join(rootDir,"data","invoices","test.pdf");

      var file_stream = fs.createReadStream(pdf_path);

      file_stream.pipe(res);
      pdfDoc.end();
    }

  }).catch((err)=>{
    StatusError(next,err,500);
  });

}


module.exports.EditAdmin = EditAdmin;

module.exports.EditOneProduct = EditOneProduct;
module.exports.AddProduct = AddProduct;
module.exports.DeleteOneProductByParams = DeleteOneProductByParams;
module.exports.DeleteOneProduct = DeleteOneProduct;
module.exports.UpdateLocation = UpdateLocation;

module.exports.GetMainPage = GetMainPage;
module.exports.GetOrderPage = GetOrderPage;
module.exports.GetProductDetailPage = GetProductDetailPage;
module.exports.HardResetProducts = HardResetProducts;

module.exports.GetProductsData = GetProductsData;
module.exports.GetAdminData = GetAdminData;
module.exports.GetOneProduct = GetOneProduct;
module.exports.GetOneProductByParams = GetOneProductByParams;

module.exports.DownloadOrder = DownloadOrder;
