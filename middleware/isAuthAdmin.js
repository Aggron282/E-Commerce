module.exports = (req,res,next) => {

  if(!req.session.isAuthenticatedAdmin || !req.session.admin){

    res.redirect("/admin/login");
    res.end();

    return;
    
  }else{
    next();
  }

}
