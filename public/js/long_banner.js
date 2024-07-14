var left_arrow_element = document.querySelector(".arrow_banner--left ");
var right_arrow_element = document.querySelector(".arrow_banner--right");
var banner_element = document.querySelector('.products_banner');

var offset_counter = 0;
var offset_increment = 650;
var offsetLeftProp;

function scrollInElement(multiplier){
  offsetLeftProp = banner_element.offsetLeft;
  banner_element.scrollLeft += (Math.abs(offset_increment) * multiplier);
}

 right_arrow_element.addEventListener("click",(e)=>{
   offset_counter++;
   scrollInElement(1);
 });


 left_arrow_element.addEventListener("click",(e)=>{
   offset_counter--;
   scrollInElement(-1);
 });
