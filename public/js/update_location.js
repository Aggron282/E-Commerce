var location_choice = document.querySelector("#update_location");
var location_modal = document.querySelector(".update_location_container");
var exit_location =document.querySelector(".exit_location");


var canEditLocation = false;

location_choice.addEventListener("click",(e)=>{
  ToggleLocationModal()
});

exit_location.addEventListener("click",(e)=>{
  ToggleLocationModal(false)
});


function ToggleLocationModal(toggle){

  if(toggle){
    canEditLocation = toggle;
  }
  else{
    canEditLocation = !canEditLocation;
  }

  if(canEditLocation){
    document.querySelector(".profile_wrapper").classList.add("active_wr")
    location_modal.classList.add("update_location_container_active");
  }
  else{
    document.querySelector(".profile_wrapper").classList.remove("active_wr")
    location_modal.classList.remove("update_location_container_active");
  }

}
