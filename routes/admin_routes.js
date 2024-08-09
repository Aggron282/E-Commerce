var router = require("express").Router();
var path = require("path");
var rootDir = require("./../util/path.js");
var adminControllers = require("./../controllers/admin_controllers.js");
var isAuth = require("./../middleware/isAuthAdmin.js");

router.post("/admin/add_product",isAuth,adminControllers.AddProduct);
router.post("/product/edit",isAuth,adminControllers.EditOneProduct);
router.post("/product/delete",isAuth,adminControllers.DeleteOneProduct);
router.get("/admin",isAuth,adminControllers.GetMainPage);
router.get("/admin/get_products",isAuth,adminControllers.GetProducts);
router.get("/edit/:id",isAuth,adminControllers.FindOneProduct);
router.get("/user_orders",isAuth,adminControllers.GetOrderPage);
router.get("/admin/add_product",isAuth,adminControllers.GetMainPage);
router.get("/user_orders/:orderId",isAuth,adminControllers.DownloadOrder);
router.get("/admin/products/all",isAuth,adminControllers.GetProductsData);
router.delete("/admin/delete_product/:_id",isAuth,adminControllers.DeleteOneProductClient);
router.get("/admin/product/detail/:_id",isAuth,adminControllers.GetProductDetail);

module.exports = router;
