var cart_button = null;
var cart_container = null;

var product_by_search_cart_buttons = [];

var add_to_cart_from_detail = document.querySelector("#product_detail_button--add");
var navbar_user_container = document.querySelector(".navbar_user_container--cart");
var product_item_cart = document.querySelector(".product_item_button--cart");

if(navbar_user_container){
  cart_container = document.querySelector(".navbar_user_container--cart");
}

if(add_to_cart_from_detail){

    add_to_cart_from_detail.addEventListener("click",(e)=>{

      var product_id = e.target.getAttribute("product_id");
      var quantity_input = document.querySelector(".product_detail_input--quantity");
      var quantity = parseInt(quantity_input.value);

      AddToCart(product_id,quantity);

    });

}

if(product_item_cart){

   product_by_search_cart_buttons = document.getElementsByClassName("product_item_button--cart")

   for(var i = 0; i < product_by_search_cart_buttons.length; i++){

    product_by_search_cart_buttons[i].addEventListener("click",(e)=>{

      var product_id = e.target.getAttribute("_id");
      var quantity_input = document.querySelector(".product_detail_input--quantity");

      quantity = parseInt(quantity_input.value);

      AddToCart(product_id,quantity);

    });

  }

}

const AddToCart = (product_id,quantity) => {

  axios.post("/cart",{productId:product_id,quantity:quantity},{header:{"Content-Type":"application/json"}}).then((res)=>{

    if(!res){
      alert("Product Is No Longer In Inventory");
      return;
    }
    else if(res.data.error){

        if(res.data.error == 401){
          window.location.assign("/login");
        }

    }

    if(res.data){

      axios.get("/cart/cart_data").then((res)=>{

          if(res.error){
            console.log(res.error);
          }
          else{

            if(cart_container){
              var cart_number = `<p id="cart_number"> ${res.data.items.length} </p>`;
              cart_container.innerHTML = cart_number;
            }

            RenderPopup("Add Item To Cart!");

          }

      });

    }

  });

}
