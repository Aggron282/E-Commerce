var router = require("express").Router();
var path = require("path");
var multer = require("multer");
const upload = multer({dest:"images/"});
var rootDir = require("./../util/path.js");
var adminControllers = require("./../controllers/admin_controllers.js");
const {check,body} = require("express-validator");
const isAuth = require("./../middleware/isAuthAdmin.js");

// Admin Product Changes
router.post("/admin/product/edit",
  check("title").isLength({min:1}).withMessage("Field is Empty"),
  check("quantity").isLength({min:1}).withMessage("Field is Empty"),
  check("price").isLength({min:1}).withMessage("Field is Empty"),
  check("catagory").isLength({min:1}).withMessage("Field is Empty"),
  check("banner").isLength({min:1}).withMessage("Field is Empty"),
  isAuth,adminControllers.EditOneProduct);
router.post("/admin/product/delete",isAuth,adminControllers.DeleteOneProduct);
router.post("/admin/product/add",
check("title").isLength({min:1}).withMessage("Field is Empty"),
check("quantity").isLength({min:1}).withMessage("Field is Empty"),
check("price").isLength({min:1}).withMessage("Field is Empty"),
check("catagory").isLength({min:1}).withMessage("Field is Empty"),
check("banner").isLength({min:1}).withMessage("Field is Empty")
,isAuth,adminControllers.AddProduct);

router.get("/admin/product/delete/:_id",isAuth,adminControllers.DeleteOneProductByParams);

// Admin URL Pages
router.get("/admin",isAuth,adminControllers.GetMainPage);
router.get("/admin/orders",isAuth,adminControllers.GetOrderPage);
router.get("/admin/product/:_id",isAuth,adminControllers.GetProductDetailPage);

// Admin Queries
router.get("/admin/profile/data",isAuth,adminControllers.GetAdminData);
router.get("/admin/product/one/:id",isAuth,adminControllers.GetOneProductByParams);
router.get("/admin/products/all",isAuth,adminControllers.GetProductsData);
router.post("/admin/product/one/",isAuth,adminControllers.GetOneProduct);

// Admin Profile Changes
router.post("/admin/profile/edit",isAuth,adminControllers.EditAdmin);
router.get("/admin/product/reset/hard",isAuth,adminControllers.HardResetProducts)
router.post("/admin/location/update",isAuth,adminControllers.UpdateLocation);



module.exports = router;
