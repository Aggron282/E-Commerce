var qty = document.querySelector(".product_detail_input--quantity");

qty.addEventListener("change",(e)=>{

  if(e.target.value <=0){
    e.target.value = parseInt(0);
    e.target.innerHTML = 0;
  }else{
      e.target.value = parseInt(e.target.value);
  }

});
