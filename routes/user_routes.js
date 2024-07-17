var router = require("express").Router();
var userControllers = require("./../controllers/user_controllers.js");
var isAuth = require("./../middleware/isAuth.js");

router.get("/",userControllers.GetHomePage);
router.get("/checkout/cancel",userControllers.GetCheckoutPage);
router.get("/checkout/success",userControllers.AddOrder);
router.get("/cart/purchase",userControllers.GetCheckoutPage);
router.get("/cart/pay",userControllers.AddOrder);
router.get("/cart",userControllers.GetCartPage);
router.get("/user/",userControllers.GetAdminPage);
router.get("/get_products",userControllers.GetProducts);
router.get("/product/:_id",userControllers.GetProductDetail);
router.get("/orders/",userControllers.GetOrders);
router.get("/catagories",userControllers.GetCatagories);
router.get("/cart/cart_data",userControllers.GetCurrentCart);
router.post("/cart",userControllers.AddToCart);
router.post("/cart/delete",userControllers.DeleteCartItem);
router.post("/delete/cart",userControllers.AddToCart);
router.post("/catagories",userControllers.ToggleCatagories);
router.post("/search/product",userControllers.GetSearchResults);

module.exports = router;
