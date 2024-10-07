var left_arrow = document.querySelector(".arrow_banner--left ");
var right_arrow = document.querySelector(".arrow_banner--right");
var banner_element = document.querySelector('.items_banner_container--inner');

var offset_counter = 0;
var offset_increment = 650;
var offsetLeftProp;

const ScrollInElement = (multiplier) => {
  offsetLeftProp = banner_element.offsetLeft;
  banner_element.scrollLeft += (Math.abs(offset_increment) * multiplier);
}

 right_arrow.addEventListener("click",(e)=>{
   offset_counter++;
   ScrollInElement(1);
 });

 left_arrow.addEventListener("click",(e)=>{
   offset_counter--;
   ScrollInElement(-1);
 });
