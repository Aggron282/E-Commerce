var cart_button = document.querySelector("#add_cart_button");
var cart_number = document.querySelector(".bubble_cart_return");

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
            cart_number.innerHTML = `<p class="margin-top-20 white" id="cart_number" > ${res.data.items.length} </p>`;
          }

        }

      })

    }

  })

}
