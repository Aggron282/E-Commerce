var path = require("path");
var bcrypt = require("bcrypt");
var fileHelper = require("./../util/file.js");
//AIzaSyACepJIoDZ1rhhju2bK-lO23qIzaKwXsnY
//const nodemailer = require("nodemailer");
const {validationResult} = require("express-validator");

var User = require("./../models/user.js")
var Admin = require("./../models/admin.js")

var auth = require("./../util/auth.js");
var rootDir = require("./../util/path.js");
const StatusError = require("./../util/status_error.js");

const CREATEACCOUNTPAGEURL = path.join(rootDir,"views","auth","create_account.ejs");
const LOGINPAGEURL = path.join(rootDir,"views","auth","login.ejs");

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOUR = 60 * MINUTES;
const DAY = 24 * HOUR;

const FUTURETIMEFIXED = 2 * DAY;


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

    Admin.findOne({email:email}).then(async (response)=>{

      if(!response){

          bcrypt.hash(password,12).then(async (encrypt)=>{

            const new_admin = new Admin({
              email: email,
              name:name,
              password:encrypt,
              profileImg:"",
              products:[]
            });

            new_admin.save();

            req.session.admin = new_admin;

            await req.session.save();

            res.redirect(ADMIN_LOGIN_CONFIG.login_url);

         });

      }
      else{
        res.redirect(ADMIN_LOGIN_CONFIG.create_url);
      }

    });

  }
  else{
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

        bcrypt.compare(config.password,found_user.password).then((isFound)=>{

          if(isFound){

            req.session.isAuthenticatedAdmin = true;
            req.session.admin = found_user;

            req.session.save((err)=>{
              res.status(200).json(true);
              return;
            });

          }
          else{
            res.status(403).json(false);
            return;
          }

        }).catch((err)=>{
          throw new Error();
        })

      }else{
        res.status(403).json(false);
        return;
      }

    }).catch((err)=>{
      res.status(500).json(false);
      return;
    });

  }

module.exports.GetCreateAccountPage = GetCreateAccountPage;
module.exports.GetAdminLoginPage = GetAdminLoginPage;
module.exports.CreateAccount = CreateAccount;
module.exports.PostAdminLogin = PostAdminLogin;
