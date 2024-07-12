const router = require("express").Router();
const auth_controller = require("./../controllers/auth_controller.js");
const {check,body} = require("express-validator");

router.get("/login",auth_controller.GetUserLoginPage);
router.post("/login",check("username").isEmail().normalizeEmail(),body("password").trim(),auth_controller.PostUserLogin);
router.get("/logout",auth_controller.Logout);
router.get("/create_account",auth_controller.GetCreateAccountPage);
router.post(
  "/create_account",
  check("username").isEmail().custom((v)=>{
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
  auth_controller.CreateAccount
);
router.get("/reset",auth_controller.GetResetPage);
router.post("/reset",auth_controller.PostResetEmail);
router.get("/reset_password/:token",auth_controller.GetNewPassword);
router.post("/reset_password",auth_controller.PostNewPassword);


module.exports = router;
