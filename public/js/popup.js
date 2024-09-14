document.body.addEventListener("click",(e)=>{

  if(document.getElementsByClassName("popup_message").length > 0){

    var popups = document.getElementsByClassName("popup_message");

    for(var i = 0; i < popups.length; i++){
      popups[i].classList.remove("popup_message--active");
    }

  }

});
