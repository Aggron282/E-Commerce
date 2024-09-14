var quantity_input = document.querySelector(".product_detail_input--quantity");


const CheckQuantity = (quantity,element) =>{

  if(quantity <= 0){
    element.innerHTML = 0;
  }else{
    element.value = parseInt(quantity);
  }

}

quantity_input.addEventListener("change",(e)=>{

  var target = e.target;
  var quantity = target.value;
  CheckQuantity(quantity,target);
  
});
