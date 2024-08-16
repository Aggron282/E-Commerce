var location_choice = document.querySelector("#update_location");

var location_modal = document.querySelector(".update_location_container");
var exit_location =document.querySelector(".exit_location");
var location_form = document.querySelector(".location_form");
var address_input = document.querySelector(".current_location_input");
var location_button = document.querySelector(".update_location_button");
var map_container = document.querySelector(".map_container");
var current_location_button = document.querySelector(".current_location_button")

var current_location_data;
var current_address_data;

function RenderMapElement({latitude,longitude}){

  var html = `<gmp-map center="${latitude}, ${longitude}" zoom="10"  id = "google_map" map-id="map_interface" style="height: 200px"></gmp-map>`;

  map_container.innerHTML = html;

}


var canEditLocation = false;

location_choice.addEventListener("click",(e)=>{
  ToggleLocationModal()
});

exit_location.addEventListener("click",(e)=>{
  ToggleLocationModal(false)
});

location_form.addEventListener("submit",(e)=>{
  e.preventDefault();
  SubmitAndUpdateLocation();
});

location_button.addEventListener("click",(e)=>{
  e.preventDefault();
  SubmitAndUpdateLocation();
});

current_location_button.addEventListener("click",(e)=>{
  e.preventDefault();
  GetCurrentLocation();
})

async function SubmitAndUpdateLocation(){

  var address = address_input.value;
  var data = await axios.post("/location/convert",{address:address});
  var coords = data.data.location;

  RenderMapElement(coords);

}

function GetCurrentLocation(){

   navigator.geolocation.getCurrentPosition(async (position) => {

    var coords = position.coords;

    var config = {
      latitude:coords.latitude,
      longitude:coords.longitude
    }

    var data =  await axios.post("/location/reverse_convert",config);

    var location_data = data.data;

    var address_formatted = location_data.address.city + "," + location_data.address.state + "," + location_data.address.zip;

    var new_coords = {
      latitude:location_data.coords.latitude,
      longitude:location_data.coords.longitude
    }

    console.log(location_data);

    address_input.value = address_formatted;


    RenderMapElement(new_coords);


  });

}

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
