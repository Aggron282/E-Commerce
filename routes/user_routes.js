var router = require("express").Router();

var user_controller = require("./../controllers/user_controllers.js");
var uni_controller = require("./../controllers/uni_controller.js");

var isAuth = require("./../middleware/isAuth.js");
var isAuthAdmin = require("./../middleware/isAuthAdmin.js");

//-- Cart And Checkout Handlers
router.get("/checkout/success",user_controller.AddOrder);
router.get("/cart/cancel",user_controller.GetCartPage);
router.get("/cart/pay",user_controller.AddOrder);

// Changes to User Cart
router.post("/cart",isAuth,user_controller.AddToCart);
router.post("/product/review/",isAuth,user_controller.PostProductReview);
router.post("/cart/delete",isAuth,user_controller.DeleteCartItem);
//router.post("/delete/cart",user_controller.AddToCart);
router.post("/catagories",user_controller.ToggleCatagories);

// Cart Queries
router.get("/cart",isAuth,user_controller.GetCartPage);
router.get("/cart/cart_data",isAuth,user_controller.GetCurrentCart);
router.get("/orders/",isAuth,user_controller.GetOrders);

// Get Data
router.get("/user/profile/data",isAuth,user_controller.GetProfile);

//Review
router.post("/company/review",isAuth,user_controller.PostCompanyReview);

// Page URLS
router.get("/",user_controller.GetHomePage);
router.get("/review_page=:review_page",user_controller.GetHomePage);
router.get("/product/:_id/:review_page",isAuth,user_controller.GetProductDetailPage);
router.get("/product/:_id/",isAuth,user_controller.GetProductDetailPage);
router.get("/cart/purchase",isAuth,user_controller.GetCartPage);

// Changes to User Profile
router.post("/user/profile/edit",isAuth,user_controller.EditProfile)
router.post("/user/location/update",isAuth,user_controller.UpdateLocation);

module.exports = router;
