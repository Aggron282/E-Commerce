var router = require("express").Router();
var path = require("path");
var rootDir = require("./../util/path.js");
var adminControllers = require("./../controllers/admin_controllers.js");
var isAuth = require("./../middleware/isAuth.js");

router.post("/admin/add_product",isAuth,adminControllers.AddProduct);
router.post("/product/edit",isAuth,adminControllers.EditOneProduct);
router.post("/product/delete",isAuth,adminControllers.DeleteOneProduct);

router.get("/admin/get_products",isAuth,adminControllers.GetProducts);
router.get("/edit/:id",isAuth,adminControllers.FindOneProduct);
router.get("/user_orders",isAuth,adminControllers.GetOrderPage);
router.get("/admin/add_product",isAuth,adminControllers.GetMainPage);
router.get("/user_orders/:orderId",isAuth,adminControllers.DownloadOrder);

router.delete("/admin/delete_product/:id",isAuth,adminControllers.DeleteOneProductClient);


module.exports = router;
