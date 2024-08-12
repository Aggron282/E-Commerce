module.exports = (req,res,next) => {

  if(!req.session.isAuthenticatedAdmin){
    res.redirect("/admin/login");
  }

  next();

}
