var router = require("express").Router();
var userControllers = require("./../controllers/user_controllers.js");
var adminControllers = require("./../controllers/admin_controllers.js");
var isAuth = require("./../middleware/isAuth.js");
var isAuthAdmin = require("./../middleware/isAuthAdmin.js");


//-- Cart And Checkout Handlers
router.get("/checkout/success",userControllers.AddOrder);
router.get("/cart/cancel",userControllers.GetCartPage);
router.get("/cart/pay",userControllers.AddOrder);

// Cart Queries
router.get("/cart",isAuth,userControllers.GetCartPage);
router.get("/cart/cart_data",isAuth,userControllers.GetCurrentCart);
router.get("/orders/",isAuth,userControllers.GetOrders);

// Page URLS
router.get("/",userControllers.GetHomePage);
router.get("/product/:_id",isAuth,userControllers.GetProductDetailPage);
router.get("/cart/purchase",isAuth,userControllers.GetCartPage);

// Queries
router.get("/get_products",userControllers.GetProducts);
router.get("/search/product/item=:product/page_counter=:page_counter",userControllers.GetSearchResults);
router.get("/search/product/catagory=:catagory/page_counter=:page_counter",userControllers.GetCatagoryResults);

router.get("/catagories",userControllers.GetCatagories);
router.get("/user/profile/data",isAuth,userControllers.GetProfile);

// Changes to User Cart
router.post("/cart",userControllers.AddToCart);
router.post("/cart/delete",isAuth,userControllers.DeleteCartItem);
//router.post("/delete/cart",userControllers.AddToCart);
router.post("/catagories",userControllers.ToggleCatagories);

// Changes to User Profile
router.post("/user/profile/edit",isAuth,userControllers.EditProfile)

router.post("/location/convert",adminControllers.ConvertLocation);
router.post("/location/reverse_convert",adminControllers.ReverseConvertLocation);

router.post("/user/location/update",isAuth,userControllers.UpdateLocation);
router.post("/admin/location/update",isAuthAdmin,adminControllers.UpdateLocation);



module.exports = router;
