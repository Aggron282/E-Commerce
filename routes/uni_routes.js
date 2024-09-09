var router = require("express").Router();
var admin_controller = require("./../controllers/admin_controllers.js");
var user_controller = require("./../controllers/user_controllers.js");
var uni_controller = require("./../controllers/uni_controller.js");
var isAuth = require("./../middleware/isAuth.js");
var isAuthAdmin = require("./../middleware/isAuthAdmin.js");

router.post("/location/convert",uni_controller.ConvertLocation);
router.post("/location/reverse_convert",uni_controller.ReverseConvertLocation);
router.get("/search/product/catagory=:catagory/page_counter=:page_counter/isAdmin=:isAdmin",uni_controller.GetCatagoryResults);
router.get("/search/product/item=:product/page_counter=:page_counter/isAdmin=:isAdmin",uni_controller.GetSearchResults);
router.get("/company/review",uni_controller.GetReviews);
router.get("/get_products",uni_controller.GetProducts);
router.get("/catagories",uni_controller.GetCatagories);



module.exports = router;
