var dropdown_list_admin = document.querySelector(".navbar_dropdown_list_container--admin");
var dropdown_list_user = document.querySelector(".navbar_dropdown_list_container--user");

var profile_admin = document.querySelector(".profile_icon--admin");
var profile_user = document.querySelector(".profile_icon--user");
var isDropdownOpen = false;
var main_content = document.querySelector(".main_content");


function ToggleDropdown(dropdown,isOpen){

  console.log(dropdown);
  isDropdownOpen = isOpen;

  if(isOpen){
    dropdown.classList.add("dropdown_list--active");
  }
  else{
    dropdown.classList.remove("dropdown_list--active");
  }

}

if(profile_admin){

  profile_admin.addEventListener("click",(e)=>{
    ToggleDropdown(dropdown_list_admin,true);
  });

}

if(profile_user){

  profile_user.addEventListener("click",(e)=>{
    ToggleDropdown(dropdown_list_user,true);
  });

}

if(main_content){
main_content.addEventListener("click",(e)=>{

  if(isDropdownOpen){

    if(profile_admin){
      ToggleLocationModal(dropdown_list_admin,false);
    }
    else{
      ToggleLocationModal(dropdown_list_user,false);
    }

  }

});
}
