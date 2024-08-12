var showcase_banner_element = document.querySelector(".header");
var slideshow_bubble_element = document.getElementsByClassName("bubble_showcase");

var slideshow_counter = 1;
var slideshow_max_counter = 4;


function Init(){

  for(var i =0; i <slideshow_bubble_element.length; i++){

    slideshow_bubble_element[i].addEventListener("click",(e)=>{
      ToggleCounter(e);
    });

  }

}

function ToggleCounter(e){

  var bubble_slideshow_counter = e.target.getAttribute("index");

  slideshow_counter = bubble_slideshow_counter;

  if(slideshow_counter < 1){
    slideshow_counter = slideshow_max_counter;
  }
  else if(slideshow_counter > slideshow_max_counter){
    slideshow_counter = bubble_slideshow_counter;
  }

  for(var i =1; i < slideshow_max_counter; i++){

    var banner_element = document.querySelector(`.header--${i}`);

    banner_element.classList.remove(`active`);
    banner_element.classList.add(`inactive`);

  }

  for(var i =0; i <slideshow_bubble_element.length; i++){

    if(bubble_slideshow_counter != slideshow_bubble_element[i].getAttribute("index")){
      slideshow_bubble_element[i].classList.remove("bubble_showcase--active");
    }
    else if(bubble_slideshow_counter == slideshow_bubble_element[i].getAttribute("index")){
      slideshow_bubble_element[i].classList.add("bubble_showcase--active");
    }

  }

  var new_banner_element = document.querySelector(`.header--${slideshow_counter}`);

  new_banner_element.classList.remove(`inactive`);
  new_banner_element.classList.add(`active`)

}

Init();
