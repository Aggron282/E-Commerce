var router = require("express").Router();
var userControllers = require("./../controllers/user_controllers.js");
var isAuth = require("./../middleware/isAuth.js");

//
router.get("/",userControllers.GetHomePage);
router.get("/cart",userControllers.GetCartPage);
//
router.get("/get_products",userControllers.GetProducts);
router.get("/product/:_id",userControllers.GetProductDetail);
router.get("/orders/",userControllers.GetOrders);
router.get("/catagories",userControllers.GetCatagories);
router.post("/catagories",userControllers.ToggleCatagories);
router.post("/search/product",userControllers.GetSearchResults);

router.post("/cart",userControllers.AddToCart);
router.post("/delete/cart",userControllers.AddToCart);
router.get("/checkout/cancel",userControllers.GetCheckoutPage);
router.get("/checkout/success",userControllers.AddOrder);
router.post("/cart/delete",userControllers.DeleteCartItem);
router.get("/cart/purchase",userControllers.GetCheckoutPage);
router.get("/cart/pay",userControllers.AddOrder);
router.get("/user/",userControllers.GetAdminPage);
//
module.exports = router;
