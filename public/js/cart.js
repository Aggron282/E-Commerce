var cart_button = document.querySelector("#product_detail_button--add");
var cart_container = document.querySelector(".navbar_user_container--cart");

cart_button.addEventListener("click",(e)=>{

  var product_id = e.target.getAttribute("product_id");

  AddToCart(product_id);

})

function AddToCart(product_id){

  axios.post("/cart",{productId:product_id},{header:{"Content-Type":"application/json"}}).then((res)=>{

    if(!res){
      alert("Product Is No Longer In Inventory");
      return
    }

    if(res.data){

      axios.get("/cart/cart_data").then((res)=>{

        if(res){

          if(res.error){
            console.log(res.error);
          }
          else{
            var cart_number = `<p id="cart_number"> ${res.data.items.length} </p>`;
            cart_container.innerHTML = cart_number;
          }

        }

      })

    }

  })

}
