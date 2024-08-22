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
  url:"/admin/create_account",
  validationErrors:[]
}
//-----------------------------------------------------------------------------------------
// Get URL Admin Page

const GetAdminLoginPage = async (req,res) => {
  await auth.RenderLogin(req,res,ADMIN_LOGIN_CONFIG,null,feedback);
}

const GetAdminCreateAccountPage = (req,res) => {

  feedback.url = ADMIN_LOGIN_CONFIG.create_url;

  feedback.userInput.email =  "";
  feedback.userInput.password =  "";
  feedback.userInput.name =  "";

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


module.exports.GetAdminLoginPage = GetAdminLoginPage;
module.exports.GetAdminCreateAccountPage = GetAdminCreateAccountPage;
module.exports.PostAdminLogin = PostAdminLogin;
