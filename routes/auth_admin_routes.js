const router = require("express").Router();

const user_auth_controller = require("./../controllers/user_auth_controller.js");
const admin_auth_controller = require("./../controllers/admin_auth_controller.js");

const isAuthAdmin = require("./../middleware/isAuthAdmin.js");

const {check,body} = require("express-validator");

router.post("/admin/create_account",
  check("email").isEmail().custom((v)=>{

    var value = v.toLowerCase();

    value = value.split(" ");

    if(value.includes("fuck") || value.includes("ass") || value.includes("whore") || value.includes("cunt") || value.includes("bitch")|| value.includes("nigger") || value.includes("faggot")){
      throw new Error("No curse words are allowed")
    }else{
      return true;
    }

  }).normalizeEmail(),

  body("password").isLength({min:6}).withMessage("Please enter password that is more than 6 characters").trim(),

  body("name").isLength({min:2}).withMessage("Please enter name that is 1 character or more").custom((v)=>{

    var value = v.toLowerCase();

    value = value.split(" ");

    if(value.includes("fuck") || value.includes("ass") || value.includes("whore") || value.includes("cunt") || value.includes("bitch")|| value.includes("nigger") || value.includes("faggot")){
      throw new Error("No curse words are allowed")
    }else{
      return true;
    }
  }),admin_auth_controller.CreateAccount);


router.get("/admin/login",admin_auth_controller.GetAdminLoginPage);
router.get("/admin/create_account",admin_auth_controller.GetCreateAccountPage);
router.post("/admin/login",admin_auth_controller.PostAdminLogin);


module.exports = router;
