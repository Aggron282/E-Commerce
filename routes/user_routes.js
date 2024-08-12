var router = require("express").Router();
var userControllers = require("./../controllers/user_controllers.js");
var isAuth = require("./../middleware/isAuth.js");


//-- Cart And Checkout Handlers
router.get("/checkout/success",userControllers.AddOrder);
router.get("/cart/cancel",userControllers.GetCartPage);
router.get("/cart/pay",userControllers.AddOrder);

// Cart Queries
router.get("/cart",userControllers.GetCartPage);
router.get("/cart/cart_data",userControllers.GetCurrentCart);
router.get("/orders/",userControllers.GetOrders);

// Page URLS
router.get("/",userControllers.GetHomePage);
router.get("/product/:_id",userControllers.GetProductDetailPage);
router.get("/cart/purchase",userControllers.GetCartPage);

// Queries
router.get("/get_products",userControllers.GetProducts);
router.post("/search/product",userControllers.GetSearchResults);
router.get("/catagories",userControllers.GetCatagories);
router.get("/user/profile/data",userControllers.GetProfile);

// Changes to User Cart
router.post("/cart",userControllers.AddToCart);
router.post("/cart/delete",userControllers.DeleteCartItem);
router.post("/delete/cart",userControllers.AddToCart);
router.post("/catagories",userControllers.ToggleCatagories);

// Changes to User Profile
router.post("/user/profile/edit",userControllers.EditProfile)


// Unused
// router.get("/checkout/cancel",userControllers.GetCheckoutPage);
// router.get("/cart/purchase",userControllers.GetCheckoutPage);

module.exports = router;
