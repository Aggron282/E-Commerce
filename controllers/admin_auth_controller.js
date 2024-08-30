var path = require("path");
var bcrypt = require("bcrypt");
var fileHelper = require("./../util/file.js");
//AIzaSyACepJIoDZ1rhhju2bK-lO23qIzaKwXsnY
//const nodemailer = require("nodemailer");
//const crypto = require("crypto");
const {validationResult} = require("express-validator");

var User = require("./../models/user.js")
var Admin = require("./../models/admin.js")

var auth = require("./../util/auth.js");
var rootDir = require("./../util/path.js");
const StatusError = require("./../util/status_error.js");

const CREATEACCOUNTPAGEURL = path.join(rootDir,"views","auth","create_account.ejs");
const LOGINPAGEURL = path.join(rootDir,"views","auth","login.ejs");


const ADMIN_LOGIN_CONFIG = {
  login_url:"/admin/login",
  create_url:"/admin/create_account",
  home_url:"/admin",
  type:"Admin"
}

const feedback = {
  userInput:{
    email:"",
    password:"",
    name:""
  },
  type:"Admin",
  popup_message:null,
  url:"/admin/create_account",
  validationErrors:[]
}
//-----------------------------------------------------------------------------------------
// Get URL Admin Page

const GetAdminLoginPage = async (req,res) => {
  await auth.RenderLogin(req,res,ADMIN_LOGIN_CONFIG,null,feedback);
}

const CreateAccount = (req,res) => {


  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  var errors = validationResult(req);

  feedback.userInput.email = email;
  feedback.userInput.password = password;
  feedback.userInput.name = name;
  feedback.validationErrors = errors.array();
  feedback.url = ADMIN_LOGIN_CONFIG.create_url;

  if(errors.isEmpty()){

    Admin.findOne({email:email}).then((response)=>{

      if(!response){

          // bcrypt.hash(password,12).then((encrypt)=>{

            const new_admin = new Admin({
              email: email,
              name:name,
              password:password,
              profileImg:"",
              products:[]
            });

            new_admin.save();

            req.session.admin = new_admin;

            req.session.save((err)=>{
              feedback.popup_message = "Created Your Account!"
              res.redirect(ADMIN_LOGIN_CONFIG.login_url);
            });

            // res.redirect(USER_LOGIN_CONFIG.login_url);

        // }).then(result =>{
        // });

      }
      else{
        feedback.popup_message = "Failure in Creating Account"
        res.redirect(ADMIN_LOGIN_CONFIG.create_url);
      }

    });

  }
  else{
    feedback.popup_message = "Invalid Inputs Detected"
    res.render(CREATEACCOUNTPAGEURL,feedback);
  }


}


const GetCreateAccountPage = (req,res) => {

  feedback.url = ADMIN_LOGIN_CONFIG.create_url;

  feedback.userInput.email = "";
  feedback.userInput.password = "";

  feedback.redirect = "/create_account";

  res.render(CREATEACCOUNTPAGEURL,feedback);

}
//-----------------------------------------------------------------
//Post Admin Functions
const PostAdminLogin = async (req,res,next) => {

    var config = await auth.GetLoginInfo(req);

    Admin.findOne({email:config.email}).then((found_user)=>{

      if(found_user){

        // bcrypt.compare(config.password,found_user.password).then((isFound)=>{
          if(found_user.password == config.password){

            req.session.isAuthenticatedAdmin = true;
            req.session.admin = found_user;

            req.session.save((err)=>{
              res.redirect(ADMIN_LOGIN_CONFIG.home_url);
              return;
            });

            return;

          }
          else{
            auth.RenderLogin(req,res,ADMIN_LOGIN_CONFIG.home_url,config,feedback);
            return;
          }

      }
      else{
        auth.RenderLogin(req,res,ADMIN_LOGIN_CONFIG,config,feedback);
        return;
      }

    }).catch((err)=>{
      auth.RenderLogin(req,res,ADMIN_LOGIN_CONFIG,config,feedback);
    });

  }

module.exports.GetCreateAccountPage = GetCreateAccountPage;
module.exports.GetAdminLoginPage = GetAdminLoginPage;
module.exports.CreateAccount = CreateAccount;
module.exports.PostAdminLogin = PostAdminLogin;
