var edit_profile = document.querySelector("#edit_profile");
var edit_profile_admin = document.querySelector("#edit_profile_admin");

var submit_form = document.querySelector(".profile_change_form");
var profile_container = document.querySelector(".profile_change_container");
var exit_profile = document.querySelector(".profile_change--exit");
var submit_profile = document.querySelector(".profile_change_button--submit");
var profile_name = document.querySelector(".profile_change_input--name");
var profile_username = document.querySelector(".profile_change_input--username");
var profile_password = document.querySelector(".profile_change_input--password");
var profile_confirm = document.querySelector(".profile_change_input--confirm");
var profile_dropdown_opener = document.querySelector(".navbar_user_col--profile");
var main_content = document.querySelector(".main_content");
var dropdown = document.querySelector(".navbar_dropdown_list_container--user") ? document.querySelector(".navbar_dropdown_list_container--user") : document.querySelector(".navbar_dropdown_list_container--admin");

var canEditProfile = false;
var profile = null;

//-----------------------------------------------Set Form and Reveal Modal-----------------------------
function PopulateAndSetEditProfileModal(toggle,url){

  if(toggle){
    canEditProfile = toggle;
  }
  else{
    canEditProfile = !canEditProfile;
  }

  if(canEditProfile){
    PopulateProfileForm(url);
    console.log(main_content);
    main_content.classList.remove("main_content--active")
    profile_container.classList.add("profile_change_container--active");
  }
  else{
    main_content.classList.add("main_content--active")
    profile_container.classList.remove("profile_change_container--active");
  }

}

//-----------------------------------------------Get and Post Profile Data-----------------------------

async function PopulateProfileForm (url){
  console.log(url);
  var profile =  axios.get(url).then((response)=>{
    console.log(response);
    var data = response.data;
    console.log(data.name);
    profile_name.value = data.name;
    profile_username.value = data.email;
    profile_password.value = "";
    profile_confirm.value = "";

    profile = data;

  }).catch((err)=>{console.log(err)});

}

function SubmitProfileEdit({name,username,password,confirm},e){

  console.log(e);
  e.preventDefault();

  if(password.length <=-1){
    alert("Password Too Short");
    return;
  }
  else{

    if(confirm == password){
      submit_form.submit();
    }
    else{
      alert("Passwords Do Not Match")
    }

  }

}




//-----------------------------------------------Add EventListeners to Elements ------------------------
if(edit_profile){

  edit_profile.addEventListener("click",(e)=>{
    ToggleDropdown(dropdown,false)
    PopulateAndSetEditProfileModal(null,"/user/profile/data");
  });

}

if(edit_profile_admin){

  edit_profile_admin.addEventListener("click",(e)=>{
    ToggleDropdown(dropdown,false)
    PopulateAndSetEditProfileModal(null,"/admin/profile/data");
  });

}

if(submit_profile){

  submit_profile.addEventListener("click",(e)=>{

    var config = {
        name: profile_name.value,
        username: profile_username.value,
        password: profile_password.value,
        confirm : profile_confirm.value
      }
      e.preventDefault();
      SubmitProfileEdit(config,e);

  });

}


if(submit_form){

  submit_form.addEventListener("submit",(e)=>{

    var config = {
        name: profile_name.value,
        username: profile_username.value,
        password: profile_password.value,
        confirm : profile_confirm.value
      }
      e.preventDefault();
      SubmitProfileEdit(config,e);

  });

}

if(profile_dropdown_opener){

  profile_dropdown_opener.addEventListener("click",(e)=>{
    ToggleDropdown(dropdown,true);
  });

}

if(document.querySelector(".main_content")){

  document.querySelector(".main_content").addEventListener("click",(e)=>{

    if(isDropdownOpen){
      ToggleDropdown(dropdown,false);
    }

  });

}

exit_profile.addEventListener("click",(e)=>{
  PopulateAndSetEditProfileModal(false,null);
});
