var Admin = require("./models/admin.js");
var User = require("./models/user.js");
var Products = require("./models/products.js");

var express = require("express");
var ejs = require("ejs");
var cors = require("cors");
var bodyParser = require("body-parser");
var csrf = require('csrf');
var bcrypt = require("bcrypt")
var path = require("path");
var session = require("express-session");
var multer = require("multer");
var mongoose = require("mongoose");

var db_util = require("./util/db.js");

var MongoDBStore = require('connect-mongodb-session')(session);

var user_routes = require("./routes/user_routes.js");
var admin_routes = require("./routes/admin_routes.js");
var uni_routes = require("./routes/uni_routes.js");
var user_auth_routes = require("./routes/user_auth_routes.js");
var admin_auth_routes = require("./routes/auth_admin_routes.js");

var rootDir = require("./util/path.js");
var image_handler = require("./util/image_handler.js");
var user_util = require("./util/user.js");

var port = process.env.PORT || 3003 ;
var hasInit = false;

var app = express();

var StoreSession =  new MongoDBStore({
  uri:"mongodb+srv://mawile12:sableye12@cluster0.mv38jgm.mongodb.net/shop?",
  collection:"session"
});


const ERRORPAGEURL = path.join(rootDir,"views","error","error.ejs");
const ERRORPAGE404URL = path.join(rootDir,"views","error","404.ejs");

app.set("views","views")
app.set("view engine","ejs");

const fileStorage = multer.diskStorage({

  destination: (req,file,cb) =>{
    cb(null,"images")
  },
  filename: (req,file,cb) =>{
    cb(null,new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }

})

function SetDefaultAdmin(){

  Admin.find({}).then((default_admin)=>{

    if(default_admin.length > 0){
      return default_admin[0];
    }
    else{

      Products.find({}).then((prods)=>{

        var config = user_util.GetDummyUser();

        var new_admin = new Admin(config);

        new_admin.save();

        return new_admin;

      });

    }

  });

}

app.use(session({secret:"43489438994388948949842894389",saveUninitialized:false,store:StoreSession}));

app.use(multer({storage:fileStorage,fileFilter: function(req,file, cb) {
    image_handler.checkFileType(file, cb);
}}).single("thumbnail"));


app.use((req,res,next)=>{

  if(req.session.user){

    User.findById(req.session.user._id).then((user)=>{
      req.user = user;
      next();
    });

  }
  else{
    req.user = null;
    next();
  }

});

app.use(async (req,res,next)=>{

  if(req.session.admin){

    Admin.findById(req.session.admin._id).then(async (admin)=>{

        if(!admin){
          req.admin = await SetDefaultAdmin(req,res,next);
          next();
        }
        else{
          req.admin = admin;
          next();
        }

      })

  }else{
    req.admin = await SetDefaultAdmin();
    next();
  }

});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));

app.use("/images",express.static(path.join(__dirname,"images")))

app.use(cors());

app.use(user_auth_routes);
app.use(admin_auth_routes);

app.use(admin_routes);
app.use(user_routes);
app.use(uni_routes);

app.get("/error",((req,res)=>{
  res.render();
}));

app.use((error,req,res,next)=>{

  res.locals.error = error;

  const status = error.status || 500;

  res.status(500).render(ERRORPAGEURL,{
    err:error.msg,
    statusCode:error.statusCode
  });

});

app.use((req,res)=>{
  res.render(ERRORPAGE404URL);
});

app.use((err, req, res, next) => {

  res.locals.error = err;

  const status = err.status || 500;

  res.status(status);
  res.render(ERRORPAGEURL,{err:err.msg,statusCode:error.statusCode});

});

mongoose.connect("mongodb+srv://mawile12:sableye12@cluster0.mv38jgm.mongodb.net/shop?retryWrites=true&w=majority").then((s)=>{

  User.find().then((users)=>{

    if(users.length <= 0){

      var schema_ = {
        name:"Marco Khodr",
        email:"marcokhodr16@gmail.com",
        cart:{
          items:{
              prodId:"",
              quantity:1
          }
        }
      }

      var new_user = new User(schema_);

      new_user.save();

    }

  }).then(()=>{

    app.listen(port,()=>{
      console.log("Running on localhost:"+port)
    });

  });

}).catch(err => console.log(err));
