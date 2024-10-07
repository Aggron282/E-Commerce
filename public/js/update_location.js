var location_choice = document.querySelector("#update_location");
var location_choice_admin = document.querySelector("#update_location--admin");

var location_modal = document.querySelector(".update_location_container");
var location_form = document.querySelector(".update_location_form");

var exit_location =document.querySelector(".update_location--exit");

var update_location_url = location_form.getAttribute("action");
var update_location_admin_check = location_form.getAttribute("isAdmin");

var address_input = document.querySelector(".update_location_input");
var location_button = document.querySelector(".update_location_button--submit");
var map_container = document.querySelector(".update_location_map");
var current_location_button = document.querySelector(".update_location_button--current")

var navbar_delivery_col = document.querySelector(".navbar_user_col--delivery")

var dropdown_list_user = document.querySelector(".navbar_dropdown_list_container--user");
var dropdown_ = dropdown_list_admin ? dropdown_list_admin : dropdown_list_user;
var dropdown_list_admin = document.querySelector(".navbar_dropdown_list_container--admin");
var navbar_update_location_list_dropdown = document.querySelector(".navbar_user_list_dropdown--update_location");

var current_location_data;
var current_address_data;
var data_url = "";
var canEditLocation = false;


const TurnOffDropdownAndToggleModal = (on) => {
  console.log(on)
  ToggleDropdown(dropdown_,false);
  ToggleLocationModal(on);
}

const SubmitAndUpdateLocation = async () => {

  if(location_form.getAttribute("isAuth") == "true"){

    var address = address_input.value;

    var data = await axios.post("/location/convert",{address:address});

    var new_location_data = data.data.location;

    current_address_data = address;

    if(!new_location_data){
        RenderPopup("Invalid Location");
        return;
    }
    else{

        RenderMapElement(new_location_data.coords);

        var update_location = await axios.post(update_location_url,new_location_data);

        if(update_location.data){
          RenderPopup("Location Updated");
        }else{
          RenderPopup("Error Occured");
        }

      }

    }else{

      var login_url = update_location_admin_check == "true" ?  "/admin/login" : "/login";

      window.location.assign(login_url);

    }

}

const GetCurrentLocation = () =>{

   navigator.geolocation.getCurrentPosition(async (position) => {

      var coords = position.coords;

      var config = {
        latitude:coords.latitude,
        longitude:coords.longitude
      }

      axios.post("/location/reverse_convert",config).then((data)=>{

        var location_data = data.data;

        var address_formatted = location_data.address.city + "," + location_data.address.state + "," + location_data.address.zip;

        var new_coords = {
          latitude:location_data.coords ? location_data.coords.latitude  : null,
          longitude:location_data.coords ? location_data.coords.longitude  : null,
        }

        address_input.value = address_formatted;

        if(new_coords.latitude && new_coords.longitude){
          RenderMapElement(new_coords);
        }

    });

  });

}

const ToggleLocationModal = (toggle) =>{

  var overlay = document.querySelector(".black_overlay");
  console.log(toggle);
  if(toggle != null){
    canEditLocation = toggle;
  }
  else{
    canEditLocation = !canEditLocation;
  }
  console.log(canEditLocation)
  if(!canEditLocation){
    overlay.classList.remove("black_overlay--active")
    location_modal.classList.remove("update_location_container--active");
  }
  else{
    overlay.classList.add("black_overlay--active")
    location_modal.classList.add("update_location_container--active");
  }

}

const PopulateLocationModal = async(url) => {

  var data = await axios.get(url);
  var location_data = data.data;
  var coords = null;

  if(location_data.location){
    address_input.value = location_data.location.address ? location_data.location.address : "" ;
    coords = location_data.location.coords
  }

  RenderMapElement(coords);

}

const RenderMapElement = (location) =>{

  var lat;
  var long;

  if(!location){
    lat = 0;
    long = 0;
  }
  else{
    lat = location.latitude;
    long = location.longitude;
  }

  var html = `<gmp-map center="${lat}, ${long}" zoom="13"  id = "google_map" map-id="map_interface" style="height: 200px"></gmp-map>`;

  map_container.innerHTML = html;

}


if(location_choice){

  location_choice.addEventListener("click",(e)=>{
    TurnOffDropdownAndToggleModal(true);
  });

}

if(location_choice_admin){

  location_choice_admin.addEventListener("click",(e)=>{
    TurnOffDropdownAndToggleModal(true);
  });

}
else if(navbar_delivery_col){

  navbar_delivery_col.addEventListener("click",(e)=>{
    ToggleLocationModal(null)
  });

}

if(navbar_update_location_list_dropdown){

  navbar_update_location_list_dropdown.addEventListener("click",(e)=>{
    TurnOffDropdownAndToggleModal(true);
  });

}

if(location_choice){
  PopulateLocationModal("/user/profile/data");
}
else if(location_choice_admin){
  PopulateLocationModal("/admin/profile/data");
}

exit_location.addEventListener("click",(e)=>{
  ToggleLocationModal(false)
});

location_form.addEventListener("submit",(e)=>{

  location_form.preventDefault();

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
});
