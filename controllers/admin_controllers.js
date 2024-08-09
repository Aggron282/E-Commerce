var path = require("path");
var rootDir = require("./../util/path.js");
var fs = require("fs");
var ObjectId = require("mongodb").ObjectId;
var PDFDocument = require("pdfkit");

let totalProducts;
var page_counter = 1;

var StatusError = require("./../util/status_error.js");
var fileHelper = require("./../util/file.js");
const Product = require("./../models/products.js");
const Order = require("./../models/orders.js");

const ITEMS_PER_PAGE = 4;


const GetMainPage = (req,res,next) => {

    page_counter = 1;

     if(!req.admin){
       res.redirect("/admin/login")
       return;
     }
     Product.find({userId:req.admin._id})
      .count()
      .then((products_)=>{
        totalProducts = products_;
        return Product.find({userId:req.admin._id})
        .skip((page_counter - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
      })
     .then((products)=>{
      res.render(path.join(rootDir,"views","admin.ejs"),
      {
        products:products,
        totalProducts:totalProducts,
        hasPrev: page_counter > 1,
        isAdmin:true,
        prev:parseInt(page_counter - 1),
        hasNext: Math.ceil(ITEMS_PER_PAGE * page_counter) < totalProducts,
        last:Math.ceil(totalProducts / ITEMS_PER_PAGE),
        next:parseInt(page_counter + 1),
        first:1,
        page:page_counter
      });

    }).catch((err)=>{
      console.log(err);
      StatusError(next,err,500);
    });

}

const DeleteOneProduct = (req,res,next) =>{

  var id = req.body._id;

  Product.deleteOne({_id:new ObjectId(id)}).then((response)=>{

    if(response){
      console.log("Deleted Successfully");
    }else{
      console.log("Could not Delete");
    }

    res.json(true);

  }).catch((err)=>{
    StatusError(next,err,500);
  });

}

const DeleteOneProductClient = (req,res,next) =>{

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

const GetProducts = async (req,res,next) =>{

  var products = Product.find({}).then((data)=>{
    res.redirect("/admin/add_product")
  }).catch((err)=>{
    StatusError(next,err,500);
  });

}


const GetProductsData = async (req,res,next) =>{

  var products = Product.find({}).then((data)=>{
    res.json(data);
  }).catch((err)=>{
    StatusError(next,err,500);
  });

}


const FindOneProduct = async (req,res,next) =>{

  var _id = req.params.id;

  var products = Product.findById(_id).then((data)=>{

      var new_product = data;

      return res.json(new_product);

    }).catch((err)=>{
      StatusError(next,err,500);
    });

}

const GetProductDetail = async (req,res,next) =>{

  var id = req.params._id;

    Product.findById(id).then((product)=>{
      console.log(product);
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
      console.log(err);
     StatusError(next,err,500);
    });


}

const EditOneProduct = async (req,res,next) =>{

  var body = req.body;

  Product.findById(body._id).then((product)=>{

    product.title = body.title;
    product.thumbnail = body.thumbnail;
    product.description = body.description;
    product.price = body.price;
    product.banner = body.banner;
    product.catagory = body.catagory;
    product.quantity = body.quantity;
    product.userId = 0;
    product.discount = body.discount;

    var products = new Product(product);

    products.save().then((data)=>{
      res.redirect("/admin/add_product");
    });

  }).catch((err)=>{
    StatusError(next,err,500);
  });

}

const GetOrderPage =(req,res,next)=>{

  Order.find({"user.userId":req.user._id}).then((orders)=>{
    res.render(path.join(rootDir,"views","layouts","admin","orders.ejs"),{orders:orders});
  });

}

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

const AddProduct = async (req,res,next) =>{

    var body  = req.body;

    var schema = {
      title:body.title,
      quantity:body.quantity,
      description:body.description,
      price:body.price,
      discount:body.discount,
      catagory:body.catagory,
      banner:body.banner,
      thumbnail:req.file.path,
      userId:req.user
    }

    var products = new Product(schema);

     products.save().then((data)=>{

      Product.find().then((r)=>{console.log(r.length)}).then(()=>{
        res.redirect("/admin/add_product")
      });

    }).catch((err)=>{
      StatusError(next,err,500);
    });

}

module.exports.DeleteOneProduct = DeleteOneProduct;
module.exports.GetMainPage = GetMainPage;
module.exports.GetProducts = GetProducts;
module.exports.GetProductsData = GetProductsData;
module.exports.GetProductDetail = GetProductDetail;
module.exports.GetOrderPage = GetOrderPage;
module.exports.DownloadOrder = DownloadOrder;
module.exports.DeleteOneProductClient = DeleteOneProductClient;
module.exports.FindOneProduct = FindOneProduct;
module.exports.EditOneProduct = EditOneProduct;
module.exports.AddProduct = AddProduct;
