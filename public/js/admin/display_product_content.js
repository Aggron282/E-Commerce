
var name_content = document.querySelector(".content_text--title");
var price_content = document.querySelector(".content_text--price");
var discount_content = document.querySelector(".content_text--discount");
var catagory_content = document.querySelector(".content_text--catagory");
var description_content = document.querySelector(".content_text--description");
var image_content = document.querySelector(".content_img");
var main_interface = document.querySelector(".main_content");

var name_input = document.querySelector(".name_input");
var price_input = document.querySelector(".price_input");
var discount_input = document.querySelector(".discount_input");
var catagory_input = document.querySelector(".catagory_input");
var description_input = document.querySelector(".description_input");

const PopulateContent = (name,catagory,price,discount,thumbnail,description) => {

  if(discount > 0){
    price_content.classList.add("cross-out");
  }else{
    price_content.classList.remove("cross-out");
  }

  var discount_price = parseFloat(price - (price * (discount / 100)));

  discount_price = Math.round(discount_price * 100) / 100;

  name_content.innerHTML = name;
  catagory_content.innerHTML = catagory;
  price_content.innerHTML = "$"+price;
  discount_content.innerHTML = "$"+discount_price;
  description_content.innerHTML = description;

  image_content.setAttribute("src","/images/"+thumbnail);

}

const UpdateAddProductContent = (element,value) => {
  element.innerHTML = value;
}

const UpdateValue = (e,default_value,content) => {

  var value = e.target.value;

  if(value.length <= 0){
    value = default_value;
  }

  UpdateAddProductContent(content,value);

}

const CheckIfZero = (e) =>{

  var value = e.target.value;

  if(e.target.value == NaN){
    return 0;
  }
  else if(value.length > 0){
    return Math.abs(parseInt(value));
  }
  else{
    return 0;
  }

}

name_input.addEventListener("keyup",(e)=>{
  UpdateValue(e,"Enter Name",name_content);
});

catagory_input.addEventListener("keyup",(e)=>{
  UpdateValue(e,"Enter Catagory",catagory_content);
});

description_input.addEventListener("keyup",(e)=>{
  UpdateValue(e,"Enter Description",description_content);
});

discount_input.addEventListener("keyup",(e)=>{

  var value = CheckIfZero(e);

  e.target.value = value;

  if(document.querySelector(".price_input").value > 0){
    price = document.querySelector(".price_input").value;
  }

  if(value > 0){
    price_content.classList.add("cross-out");
  }else{
    price_content.classList.remove("cross-out");
  }

  var discount_price = parseFloat(price - (price * (value / 100)));

  discount_price = Math.round(discount_price * 100) / 100;

  UpdateAddProductContent(discount_content,"$"+discount_price );

});

price_input.addEventListener("keyup",(e)=>{

  var value = CheckIfZero(e);

  e.target.value = value;

  UpdateValue(e,"Enter Price",price_content);

});
