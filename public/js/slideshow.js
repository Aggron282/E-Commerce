
var showcase_banner = document.querySelector(".header");
var bubbles = document.getElementsByClassName("bubble_showcase");



var showcase_counter = 1;
var max = 4;


for(var i =0; i <bubbles.length; i++){

  bubbles[i].addEventListener("click",(e)=>{
    toggle_counter(e);
  });

}

function toggle_counter(e){

  var index = e.target.getAttribute("index");

  showcase_counter = index;


  if(showcase_counter < 1){
    showcase_counter = max;
  }else if(showcase_counter > max){
    showcase_counter = index;
  }

  for(var i =1; i < max; i++){

    var banner_ = document.querySelector(`.header--${i}`);
    banner_.classList.remove(`active`);
    banner_.classList.add(`inactive`);

  }


  for(var i =0; i <bubbles.length; i++){

    if(index != bubbles[i].getAttribute("index")){
      bubbles[i].classList.remove("bubble_showcase--active");
    }else if(index == bubbles[i].getAttribute("index")){
      bubbles[i].classList.add("bubble_showcase--active");
    }

  }

  var new_banner = document.querySelector(`.header--${showcase_counter}`);
  new_banner.classList.remove(`inactive`);
  new_banner.classList.add(`active`)

}
