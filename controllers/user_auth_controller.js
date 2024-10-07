var path = require("path");
//const nodemailer = require("nodemailer");
//const crypto = require("crypto");
const bcrypt = require("bcrypt");

const {validationResult} = require("express-validator");

var User = require("./../models/user.js")

var auth = require("./../util/auth.js");
var rootDir = require("./../util/path.js");

const StatusError = require("./../util/status_error.js");

const LOGINPAGE = path.join(rootDir,"views","auth","login.ejs");
const CREATEACCOUNTPAGE = path.join(rootDir,"views","auth","create_account.ejs");

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOUR = 60 * MINUTES;
const DAY = 24 * HOUR;

const FUTURETIMEFIXED = 2 * DAY;

const USER_LOGIN_CONFIG = {
  login_url:"/login",
  create_url:"/create_account",
  home_url:"/",
  type:"User"
}

const feedback = {
  userInput:{
    email:"",
    password:"",
    name:""
  },
  redirect:USER_LOGIN_CONFIG.login_url,
  type:USER_LOGIN_CONFIG.type,
  url:"",
  popup_message:null,
  validationErrors:[]
}

// const sendgridTransport = require("nodemailer-sendgrid-transport");

//------------------------------------------------------------
// User Post Functions

const PostUserLogin = (req,res,next) => {

  var email = req.body.email;
  var password = req.body.password;

  feedback.url = USER_LOGIN_CONFIG.login_url;
  feedback.userInput.email = email;
  feedback.userInput.password = password;

  var errors = validationResult(req);

  feedback.validationErrors = errors.array();

  if(errors.isEmpty()){

    User.findOne({email:email}).then((found_user)=>{

      if(found_user){

        // if(found_user.password == password){
         bcrypt.compare(password,found_user.password).then((isFound)=>{

           if(isFound){

            req.session.isAuthenticated = true;
            req.session.user = found_user;
            feedback.popup_message = "Success!"

            req.session.save((err)=>{
              res.redirect(USER_LOGIN_CONFIG.home_url);
            });

          }else{
            feedback.popup_message = "Username/Password Incorrect!"

            res.status(401).render(LOGINPAGE,feedback);
          }
        });
      }

    });

  }
  else{
    res.redirect(USER_LOGIN_CONFIG.login_url);
  }

}

const Logout = (req,res) => {

  req.user = null;
  req.isAuthenticated = false;
  req.session.destroy((err)=>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/");
    }

  })

}

const PostNewPassword = (req,res,next)=>{

  const new_password = req.body.password;
  const userId = req.body.userId;

  let resetInfo;

  User.findOne({_id:userId}).then((user)=>{

    resetInfo = user;

    bcrypt.hash(new_password,12).then((hash)=>{

      resetInfo.password = hash;
      resetInfo.resetToken = null;
      resetInfo.resetTokenExpiration = null;

      resetInfo.save();

    }).then(result =>{
      res.redirect(USER_LOGIN_CONFIG.login_url);
    }).catch(err =>{
      StatusError(next,err,500);
    });

  }).catch((err)=>{
    StatusError(next,err,500);
  });

}

const PostResetEmail = (req,res,next) =>{

  var email = req.body.email;
  var errors = validationResult(req);

  if(errors.isEmpty()){

    crypto.randomBytes(32,(err,buffer)=>{

    if(err){
      res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({email:email}).then((user)=>{

      if(!user){
        console.log("No User found");
        res.redirect("/reset");
      }

      user.resetToken = token;

      user.resetTokenExpiration = Date.now() + FUTURETIMEFIXED;

      user.save();

      return user;

    }).then((user)=>{

      res.redirect(USER_LOGIN_CONFIG.login_url)

   }).catch((err)=>{
     StatusError(next,err,500);
   });

  }).catch((err)=>{
    StatusError(next,err,500);
  });

  }else{
    res.status(202).redirect("/reset");
  }

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

  if(errors.isEmpty()){

    User.findOne({email:email}).then((response)=>{

      if(!response){

          bcrypt.hash(password,12).then((encrypt)=>{

            const new_user = new User({
              email: email,
              name:name,
              password:encrypt,
              profileImg:"",
              cart:{items:[]}
            });

            new_user.save();

            req.session.user = new_user;

            req.session.save((err)=>{
              feedback.popup_message = "Created Your Account!"
              res.redirect(USER_LOGIN_CONFIG.login_url);
            });

            // res.redirect(USER_LOGIN_CONFIG.login_url);
          });
        // }).then(result =>{
        // });

      }
      else{
        feedback.popup_message = "Failure in Creating Account"
        res.redirect(USER_LOGIN_CONFIG.create_url);
      }

    });

  }
  else{
    feedback.popup_message = "Invalid Inputs Detected"
    res.status(202).render(CREATEACCOUNTPAGE,feedback);
  }

}

//--------------------------------------------------------------------------------
// Get URL User Page Functions
const GetUserLoginPage = (req,res) => {

  feedback.url = USER_LOGIN_CONFIG.login_url;

  feedback.userInput.email = "";
  feedback.userInput.password = "";
  feedback.redirect = "/login";

  res.render(LOGINPAGE,feedback);

}

const GetResetPage = (req,res) =>{
  res.render(path.join(rootDir,"views","user","reset.ejs"));
}

const GetNewPasswordPage = (req,res,next)=>{

  const token = req.params.token;

  User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}}).then((user)=>{

    if(user._id){

      res.render(path.join(rootDir,"views","user","new_password.ejs"),{
        userId:user._id.toString()
      });

    }
    else{
      feedback.redirect = "/new_password";
      res.redirect(USER_LOGIN_CONFIG.login_url);
    }

  }).catch((err)=>{
    StatusError(next,err,500);
  });

}

const GetCreateAccountPage = (req,res) => {

  feedback.url = USER_LOGIN_CONFIG.create_url;

  feedback.userInput.email = "";
  feedback.userInput.password = "";

  feedback.redirect = "/create_account";

  res.render(CREATEACCOUNTPAGE,feedback);

}


module.exports.PostUserLogin = PostUserLogin;
module.exports.Logout = Logout;
module.exports.GetUserLoginPage = GetUserLoginPage;
module.exports.GetNewPasswordPage = GetNewPasswordPage;
module.exports.GetResetPage = GetResetPage;
module.exports.PostNewPassword = PostNewPassword;
module.exports.PostResetEmail = PostResetEmail;
module.exports.PostUserLogin = PostUserLogin;
module.exports.GetResetPage = GetResetPage;
module.exports.CreateAccount = CreateAccount;
module.exports.GetCreateAccountPage = GetCreateAccountPage;
