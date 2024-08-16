var path = require("path");
var fs = require("fs");
var PDFDocument = require("pdfkit");

var ObjectId = require("mongodb").ObjectId;

var StatusError = require("./../util/status_error.js");
var fileHelper = require("./../util/file.js");
var rootDir = require("./../util/path.js");
var location = require("./../util/location.js");


const Product = require("./../models/products.js");
const Order = require("./../models/orders.js");
var Admin = require("./../models/admin.js")

let totalProducts;



//--------------------------------------------------------------------------------
// Get Data Functions
const GetAdminData = (req,res)=>{

  if(!req.admin){
    res.redirect("/login");
    return;
  }
  else{
    res.json(req.admin);
  }

}

const ConvertLocation = async (req,res) => {

  var address = req.body.address;

  var location_data = await location.ConvertLocation(address);

  console.log(location_data);

  res.json({location:location_data});

}

const ReverseConvertLocation = async (req,res) => {

  var coords = req.body;
  console.log(coords);
  var location_data = await location.ReverseConvertLocation(coords);
  var data = location_data;
  console.log(data);
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

}

//--------------------------------------------------------------------------------
// Change Admin Profile
const EditAdmin = (req,res) => {

  var data  = req.body;

  if(!req.admin){
    res.redirect("/admin/login");
    return;
  }

  const filter = { _id : new ObjectId(req.admin._id) };
  const update = {$set:{ username : data.username, name:data.name, password:data.password } };

  Admin.findOneAndUpdate(filter,update).then((response)=>{
      req.admin = response;
  });

}

//--------------------------------------------------------------------------------
// Get Product Data

const GetProductsData = async (req,res,next) =>{

  if(!req.admin._id){
    res.redirect("/admin/login");
  }

  res.json(req.admin.products);

}

const GetOneProductByParams = async (req,res,next) =>{

  var _id = req.params.id;

  var products = Product.findById(_id).then((data)=>{

      var new_product = data;

      return res.json(new_product);

    }).catch((err)=>{
      StatusError(next,err,500);
    });

}

const GetOneProduct = (req,res,next) => {

  var _id = req.body._id;
  var isFound = false;

  if(!req.admin){
    res.redirect("/admin/login");
    return;
  }

  for(var i =0; i < req.admin.products.length; i++){

    if(JSON.stringify(_id) == JSON.stringify(req.admin.products[i]._id)){
        isFound = true;
        break;
     }

  }

  if(isFound){
    res.json(req.admin.products[i]);
  }
  else{
    res.json(false);
  }

}

//--------------------------------------------------------------------------------
// Get URL Pages
const GetMainPage = (req,res,next) =>{

    res.render(path.join(rootDir,"views","admin.ejs"),{
      products:req.admin.products,
      totalProducts:totalProducts,
      isAdmin:true,
      action:"/admin/profile/edit"
    });

}

const GetProductDetailPage = async (req,res,next) =>{

  var id = req.params._id;

    Product.findById(id).then((product)=>{
      if(!product){
        res.redirect("/admin")
      }
      else{
        res.render(path.join(rootDir,"views","user","detail.ejs"),{
          item:product,
          root:"../..",
          isAdmin:true
        });

      }

    }).catch((err)=>{
     StatusError(next,err,500);
    });


}

const GetOrderPage =(req,res,next)=>{

  Order.find({"user.userId":req.user._id}).then((orders)=>{
    res.render(path.join(rootDir,"views","layouts","admin","orders.ejs"),{orders:orders});
  });

}

//--------------------------------------------------------------------------------
// Admin Products Changes
const DeleteOneProduct = (req,res,next) =>{

  var id = req.body._id;

  Admin.findOne({_id:new ObjectId(req.admin._id)}).then((admin)=>{

      var new_admin = admin;
      var new_products = []

      for(var i = 0; i < admin.products.length; i ++){

          if(id == admin.products[i]._id){
            console.log("Same Product");
          }
          else{
            new_products.push(admin.products[i]);
          }

      }

     new_admin.products = new_products;

     Admin.replaceOne({_id:new ObjectId(req.admin._id)},new_admin).then((admin)=>{

        req.admin = new_admin;

        Product.deleteOne({_id:new ObjectId(id)}).then((response)=>{

          if(response){
            console.log("Deleted Successfully");
          }
          else{
            console.log("Could not Delete");
          }

          res.json(true);

        });

      });

    }).catch((err)=>{
      StatusError(next,err,500);
  });

}

const DeleteOneProductByParams = (req,res,next) =>{

  var id = req.params.id;

  Product.deleteOne({_id:new ObjectId(id)}).then((response)=>{

    if(response){
      console.log("Deleted Successfully");
    }else{
      console.log("Could not Delete");
    }

    res.status(200).json({message:"Deleted Successfully"});

  }).catch((err)=>{
    StatusError(next,err,500);
  });

}

const EditOneProduct = async (req,res,next) =>{

  var body = req.body;
  var new_admin = req.admin;
  var products = [...new_admin.products];

  var found_product = await Product.findOne({_id:new ObjectId(body._id)});
  var new_product = {...found_product._doc};
  new_product.title = body.title;
  new_product.thumbnail = body.thumbnail;
  new_product.description = body.description;
  new_product.price = body.price;
  new_product.banner = body.banner;
  new_product.catagory = body.catagory;
  new_product.quantity = body.quantity;
  new_product.userId = req.admin._id;
  new_product.discount = body.discount;

  var new_products = products.map((p)=>{


    if(JSON.stringify(p._id) == JSON.stringify(new_product._id)){
      return p = new_product;
    }

    return p;

  });

  var new_admin_ = new Admin(new_admin);
  var product = new Product(new_product);

  const filter = { _id : new ObjectId(new_admin_._id) };
  const update = {$set:{ products : new_products}};

  Admin.findOneAndUpdate(filter,update,{new: true,useFindAndModify:false}).then((err,doc)=>{

    new_admin_.products = new_products;

    req.session.admin = new_admin_;

    // Admin.findOne({_id:new ObjectId(new_admin_._id)}).then(async (a)=>{console.log(a.products[0].title)})

    // var admin_ = await Admin.findOne({_id:new ObjectId(new_admin_._id)});

    // await product.save();

    res.json({admin:req.session.admin});

  });

}

const AddProduct = async (req,res,nect) => {

  var body  =   req.body;
  console.log("SS");
  console.log(req.thumbnail,req.body);

  var schema = {
    title:body.title,
    quantity:body.quantity,
    description:body.description,
    price:body.price,
    discount:body.discount,
    catagory:body.catagory,
    banner:body.banner,
    thumbnail:"",
    userId:req.user
  }

  var products = new Product(schema);
  return;
  res.json(schema);

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
module.exports.ConvertLocation = ConvertLocation;
module.exports.ReverseConvertLocation = ReverseConvertLocation;
module.exports.EditOneProduct = EditOneProduct;
module.exports.AddProduct = AddProduct;
module.exports.DeleteOneProductByParams = DeleteOneProductByParams;
module.exports.DeleteOneProduct = DeleteOneProduct;

module.exports.GetMainPage = GetMainPage;
module.exports.GetOrderPage = GetOrderPage;
module.exports.GetProductDetailPage = GetProductDetailPage;

module.exports.GetProductsData = GetProductsData;
module.exports.GetAdminData = GetAdminData;
module.exports.GetOneProduct = GetOneProduct;
module.exports.GetOneProductByParams = GetOneProductByParams;

module.exports.DownloadOrder = DownloadOrder;
