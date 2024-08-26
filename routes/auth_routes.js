const router = require("express").Router();
const user_auth_controller = require("./../controllers/user_auth_controller.js");
const admin_auth_controller = require("./../controllers/admin_auth_controller.js");

const {check,body} = require("express-validator");

// User URL Pages
router.get("/login",user_auth_controller.GetUserLoginPage);
router.post("/login",check("email").isEmail().normalizeEmail(),body("password").trim(),user_auth_controller.PostUserLogin);
router.get("/logout",user_auth_controller.Logout);

router.get("/reset",user_auth_controller.GetResetPage);

router.post(
  "/create_account",
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

  body("name").isLength({min:1}).withMessage("Please enter name that is 1 character or more").custom((v)=>{

    var value = v.toLowerCase();

    value = value.split(" ");

    if(value.includes("fuck") || value.includes("ass") || value.includes("whore") || value.includes("cunt") || value.includes("bitch")|| value.includes("nigger") || value.includes("faggot")){
      throw new Error("No curse words are allowed")
    }else{
      return true;
    }

  }),

  user_auth_controller.CreateAccount
);

// User Posts
router.post("/reset",user_auth_controller.PostResetEmail);
router.post("/reset_password",user_auth_controller.PostNewPassword);

// Admin Posts
router.post("/admin/login",admin_auth_controller.PostAdminLogin);

// Admin URL Pages
router.get("/admin/login",admin_auth_controller.GetAdminLoginPage);
router.get("/admin/create_account",admin_auth_controller.GetAdminCreateAccountPage);
router.get("/create_account",user_auth_controller.GetCreateAccountPage);
router.get("/reset_password/:token",user_auth_controller.GetNewPasswordPage);

module.exports = router;
