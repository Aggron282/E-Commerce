var stripe = Stripe("pk_test_51OjAfEL9aEOLpUqjiSrhltnG3aHmrvWEppeBUnNx9OR1oXRGA4GaLJEaU3Z1fKEXd89z0uZhd04ONLoB3NQpdTmt00u5Ujogny")
var order_button_element = document.getElementById("order_button");

order_button_element.addEventListener("click",(e)=>{

    stripe.redirectToCheckout({
      sessionId:"<%= sessionId %>",
    });

});
