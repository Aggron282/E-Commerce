var router = require("express").Router();
var path = require("path");
var rootDir = require("./../util/path.js");
var adminControllers = require("./../controllers/admin_controllers.js");
var isAuth = require("./../middleware/isAuthAdmin.js");
var multer = require("multer");

const upload = multer({dest:"images/"});

// Admin Product Changes
router.post("/admin/product/edit",isAuth,adminControllers.EditOneProduct);
router.post("/product/delete",isAuth,adminControllers.DeleteOneProduct);
router.post("/admin/product/add",isAuth,adminControllers.AddProduct);
router.delete("/admin/delete_product/:_id",isAuth,adminControllers.DeleteOneProductByParams);

// Admin URL Pages
router.get("/admin",isAuth,adminControllers.GetMainPage);
router.get("/user_orders",isAuth,adminControllers.GetOrderPage);
router.get("/admin/product/detail/:_id",isAuth,adminControllers.GetProductDetailPage);

// Admin Queries
router.get("/admin/profile/data",isAuth,adminControllers.GetAdminData);
router.get("/edit/:id",isAuth,adminControllers.GetOneProductByParams);
router.get("/admin/products/all",isAuth,adminControllers.GetProductsData);
router.post("/admin/product/one/",isAuth,adminControllers.GetOneProduct);

// Admin Profile Changes
router.post("/admin/profile/edit",isAuth,adminControllers.EditAdmin);
router.get("/product/reset/hard",isAuth,adminControllers.HardResetProducts)



module.exports = router;
