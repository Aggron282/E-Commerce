var rootDir = require("./../util/path.js");
var path = require("path");
const {validationResult} = require("express-validator");

const CREATEACCOUNTPAGEURL = path.join(rootDir,"views","auth","create_account.ejs");
const LOGINPAGEURL = path.join(rootDir,"views","auth","login.ejs");

function GetLoginInfo(req){

  var email = req.body.email;
  var password = req.body.password;

  var errors = validationResult(req);

  return {
    errors:errors,
    email:email,
    password:password
  }

}

function RenderLogin(req,res,auth_config,input_config,feedback){

  if(input_config){
    feedback.userInput.email = input_config.email;
    feedback.userInput.password = input_config.password;
  }
  else{
    feedback.userInput.email = "";
    feedback.userInput.password = "";
  }

  feedback.type = auth_config.type;
  feedback.url = auth_config.login_url;
  res.render(LOGINPAGEURL,feedback);

}

module.exports.RenderLogin = RenderLogin;
module.exports.GetLoginInfo = GetLoginInfo;
