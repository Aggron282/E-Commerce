var left_arrow = document.querySelector(".arrow_banner--left ");
var right_arrow = document.querySelector(".arrow_banner--right");


var offset_counter = 0;
var offset_pos = 0;
var offset_para = 650;



function scrollInElement(multi){
  offset_pos = document.querySelector('.products_banner').offsetLeft;
  document.querySelector('.products_banner').scrollLeft += (offset_para * multi);
}


 right_arrow.addEventListener("click",(e)=>{

   offset_counter++;
   scrollInElement(1);
 });


 left_arrow.addEventListener("click",(e)=>{
   offset_counter--;
   scrollInElement(-1);
 });
