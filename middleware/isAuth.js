module.exports = (req,res,next) => {
  console.log(!req.user && !req.session.isAuthenticated);
  if(!req.session.isAuthenticated || !req.user){
    res.redirect("/login");
    res.end();
    return;
  }else{
    next();
  }

}
