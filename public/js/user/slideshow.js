var showcase_banner = document.querySelector(".header");
var slideshow_bubble = document.getElementsByClassName("bubble_showcase");

var slideshow_counter = 1;
var slideshow_max_counter = 4;

const InitSlideshow = () => {

  for(var i =0; i <slideshow_bubble.length; i++){

    slideshow_bubble[i].addEventListener("click",(e)=>{
      ToggleCounter(e);
    });

  }

}

const ToggleCounter = (e) => {

  var bubble_slideshow_counter = e.target.getAttribute("index");

  slideshow_counter = bubble_slideshow_counter;

  if(slideshow_counter < 1){
    slideshow_counter = slideshow_max_counter;
  }
  else if(slideshow_counter > slideshow_max_counter){
    slideshow_counter = bubble_slideshow_counter;
  }

  for(var i =1; i < slideshow_max_counter; i++){

    var new_banner = document.querySelector(`.header--${i}`);

    new_banner.classList.add(`slideshow--inactive`);
    new_banner.classList.remove(`slideshow--active`)

  }

  for(var i =0; i <slideshow_bubble.length; i++){

    if(bubble_slideshow_counter != slideshow_bubble[i].getAttribute("index")){
      slideshow_bubble[i].classList.remove("bubble_showcase--active");
    }
    else if(bubble_slideshow_counter == slideshow_bubble[i].getAttribute("index")){
      slideshow_bubble[i].classList.add("bubble_showcase--active");
    }

  }

  var new_banner = document.querySelector(`.header--${slideshow_counter}`);

  new_banner.classList.remove(`slideshow--inactive`);
  new_banner.classList.add(`slideshow--active`)

}

InitSlideshow();
