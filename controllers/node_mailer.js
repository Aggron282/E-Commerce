//
// const transporter = nodemailer.createTransport(sendgridTransport({
//   auth:{
//     api_key:"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"
//   }
// }));
//





//  transporter.sendMail({
//   to:email,
//   from:"info@allstarcommercestore.com",
//   subject:"Reset Password",
//   html:`Hello ${user.name}, We wanted to let you know that your All-Star ECommerce password was reset.
//
//    If you did not perform this action, you can recover access by entering ${email} into the form at http://localhost:3003/reset_password/${token}
//
//    If you run into problems, please contact support by visiting https://allstarcommercestore.com/contact
//
//    Please do not reply to this email with your password. We will never ask for your password, and we strongly discourage you from sharing it with anyone.`
//
// }).then((feedback)=>{



// console.log(result);
//  return transporter.sendMail({
//   to:username,
//   from:"info@allstarcommercestore.com",
//   subject:"Created Account",
//   html:"You have signed up!"
//
// }).then(()=>{
//   res.redirect("/login");
// }).catch(err=>{console.log(err)});
