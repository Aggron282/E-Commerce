var path = require("path");
var bcrypt = require("bcrypt");
//const nodemailer = require("nodemailer");
//const crypto = require("crypto");
const {validationResult} = require("express-validator");

var User = require("./../models/user.js")
var rootDir = require("./../util/path.js");
const StatusError = require("./../util/status_error.js");

// const sendgridTransport = require("nodemailer-sendgrid-transport");

const GetUserLoginPage = (req,res) => {

  res.render(path.join(rootDir,"views","user","login.ejs"),{

    userInput:{
      email:"",
      password:""
    },
    validationErrors:[]

  });

}

const PostUserLogin = (req,res,next) => {

  var username = req.body.username;
  var password = req.body.password;

  var errors = validationResult(req);

  if(errors.isEmpty()){

    User.findOne({email:username}).then((found_user)=>{

      if(found_user){

        bcrypt.compare(password,found_user.password).then((isFound)=>{

          if(isFound){

            req.session.isAuthenticated = true;
            req.session.user = found_user;

            req.session.save((err)=>{
              res.redirect("/");
            });

          }else{

            res.render(path.join(rootDir,"views","user","login.ejs"),{

              userInput:{
                email:username,
                password:password
              },

              validationErrors:[]

            });
          }
        }).catch((err)=>{
          StatusError(next,err,500);
        });

      }
      else{

        res.render(path.join(rootDir,"views","user","login.ejs"),{

          userInput:{
            email:username,
            password:password
          },
          validationErrors:[]
        });

      }

    });

  }
  else{

    res.status(202).render(path.join(rootDir,"views","user","login.ejs"),
     {
      userInput:{
        email:username,
        password:password
      },
      validationErrors:errors.array()
     }

   );

  }

}

const Logout = (req,res) => {

  req.session.destroy((err)=>{

    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }

  })

}


const GetResetPage = (req,res) =>{
  res.render(path.join(rootDir,"views","user","reset.ejs"));
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
      res.redirect('/login')
    })
    .catch(err =>{
      StatusError(next,err,500);
    });

  })
  .catch((err)=>{
    StatusError(next,err,500);
  });

}

const GetNewPassword = (req,res,next)=>{

  const token = req.params.token;

  User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}}).then((user)=>{

    if(user._id){

      res.render(path.join(rootDir,"views","user","new_password.ejs"),{
        userId:user._id.toString()
      });

    }
    else{
      res.redirect("/login");
    }

  })
  .catch((err)=>{
    StatusError(next,err,500);
  });

}

const PostResetEmail = (req,res,next) =>{

  var email = req.body.username;
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

      user.resetTokenExpiration = Date.now() + 360000000;

      user.save();

      return user;

    })
    .then((user)=>{


    res.redirect("/login")

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

  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;

  var errors = validationResult(req);

  if(errors.isEmpty()){

    User.findOne({email:username}).then((response)=>{

    if(!response){

      bcrypt.hash(password,12).then((encrypt)=>{

        const new_user = new User({
          email: username,
          name:name,
          password:encrypt,
          cart:{items:[]}
        });

        new_user.save();

        req.user = new_user;

    }).then(result =>{
      res.redirect("/login");
    });

    }else{
      res.redirect("/create_account");
    }

  });

  }else{

    res.status(202).render(path.join(rootDir,"views","user","create_account.ejs"),{

      userInput:{
        email:username,
        password:password,
        name:name
      },
      validationErrors:errors.array()
    });

  }

}

const GetCreateAccountPage = (req,res) => {

  res.render(path.join(rootDir,"views","user","create_account.ejs"),{

    userInput:{
      email:"",
      password:"",
      name:""
    },
    validationErrors:[]

  });

}


module.exports.GetUserLoginPage = GetUserLoginPage;
module.exports.PostUserLogin = PostUserLogin;
module.exports.Logout = Logout;
module.exports.GetNewPassword = GetNewPassword;
module.exports.GetResetPage = GetResetPage;
module.exports.PostNewPassword = PostNewPassword;
module.exports.PostResetEmail = PostResetEmail;
module.exports.PostUserLogin = PostUserLogin;
module.exports.GetResetPage = GetResetPage;
module.exports.CreateAccount = CreateAccount;
module.exports.GetCreateAccountPage = GetCreateAccountPage;
