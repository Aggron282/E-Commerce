var cart_button ;
var product_by_search_cart_buttons;
var cart_container;

if(document.querySelector("#product_detail_button--add")){
    cart_button= document.querySelector("#product_detail_button--add");


    cart_button.addEventListener("click",(e)=>{

      var product_id = e.target.getAttribute("product_id");

      AddToCart(product_id);

    });
}

if(document.querySelector(".navbar_user_container--cart")){
    cart_container = document.querySelector(".navbar_user_container--cart");
}

if(document.querySelector(".product_item_button--cart")){

   product_by_search_cart_buttons = document.getElementsByClassName("product_item_button--cart")

  for(var i = 0; i < product_by_search_cart_buttons.length; i++){

    product_by_search_cart_buttons[i].addEventListener("click",(e)=>{

      var product_id = e.target.getAttribute("_id");
      console.log(product_id);
      AddToCart(product_id);

    });

  }

}




function AddToCart(product_id){

  axios.post("/cart",{productId:product_id},{header:{"Content-Type":"application/json"}}).then((res)=>{
    console.log(res);

    if(!res){
      alert("Product Is No Longer In Inventory");
      return;
    }
    else if(res.data.error){

        if(res.data.error == 401){
          window.location.assign("/login");
        }

        console.log(res.error);

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



      })

    }

  })

}
