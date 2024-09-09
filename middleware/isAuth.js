module.exports = (req,res,next) => {

  if(!req.session.isAuthenticated || !req.user){

    res.redirect("/login");
    res.end();

    return;

  }else{
    next();
  }

}
