var stripe = Stripe("pk_test_51OjAfEL9aEOLpUqjiSrhltnG3aHmrvWEppeBUnNx9OR1oXRGA4GaLJEaU3Z1fKEXd89z0uZhd04ONLoB3NQpdTmt00u5Ujogny")
var order_button = document.getElementById("order_button");

order_button.addEventListener("click",(e)=>{

    stripe.redirectToCheckout({
      sessionId:"<%= session_id %>",
    })

});
