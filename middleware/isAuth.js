module.exports = (req,res,next) => {
  console.log(req.session)
  if(!req.session.isAuthenticated){
    res.redirect("/login");
  }
  next();
}
