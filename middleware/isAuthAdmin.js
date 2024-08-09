module.exports = (req,res,next) => {
  console.log(req.session)
  if(!req.session.isAuthenticatedAdmin){
    res.redirect("/admin/login");
  }
  next();
}
