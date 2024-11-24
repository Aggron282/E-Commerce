var edit_profile = document.querySelector("#edit_profile");
var edit_profile_admin = document.querySelector("#edit_profile_admin");

var submit_form = document.querySelector(".profile_change_form");
var profile_container = document.querySelector(".profile_change_container");

var exit_profile = document.querySelector(".profile_change--exit");
var submit_profile = document.querySelector(".profile_change_button--submit");

var profile_name_input = document.querySelector(".profile_change_input--name");
var profile_username_input = document.querySelector(".profile_change_input--username");
var profile_password_input = document.querySelector(".profile_change_input--password");
var profile_confirm_input = document.querySelector(".profile_change_input--confirm");
var profile_dropdown_opener = document.querySelector(".navbar_user_col--profile");

var main_content = document.querySelector(".main_content");

var dropdown = document.querySelector(".navbar_dropdown_list_container--user") ? document.querySelector(".navbar_dropdown_list_container--user") : document.querySelector(".navbar_dropdown_list_container--admin");

var canEditProfile = false;
var profile_data = null;

//-----------------------------------------------Set Form and Reveal Modal-----------------------------
const PopulateAndSetEditProfileModal = (toggleCanEditProfile,profile_url_form) => {

  if(toggleCanEditProfile){
    canEditProfile = toggleCanEditProfile;
  }
  else{
    canEditProfile = !canEditProfile;
  }

  if(canEditProfile){

    PopulateProfileForm(profile_url_form);

    main_content.classList.remove("main_content--active")
    profile_container.classList.add("profile_change_container--active");

  }
  else{
    main_content.classList.add("main_content--active")
    profile_container.classList.remove("profile_change_container--active");
  }

}

//-----------------------------------------------Get and Post Profile Data-----------------------------

const PopulateProfileForm = async (profile_url_form) => {

  axios.get(profile_url_form).then((response)=>{

    var profile_response = response.data;

    profile_name_input.value = profile_response.name;
    profile_username_input.value = profile_response.email;
    profile_password_input.value = "";
    profile_confirm_input.value = "";


  }).catch((err)=>{console.log(err)});

}

const SubmitProfileEdit = async ({name,username,password,confirm},e) => {


  var data = CreateFormData(submit_form);
  var url = submit_form.getAttribute("action");

  if(data.confirm == data.password){
      const response = await axios.post(url,data);

          if(response.data){
            CreatePopup("Updated Profile!");
            DelayedRefresh(1000);
          }else{
            CreatePopup("Unable to Update")
          }
    }
    else{
      CreatePopup("Passwords do not Match")
    }

}

const ConfigureAndSubmit = (e) =>{

  var config = {
     name: profile_name_input.value,
     username: profile_username_input.value,
     password: profile_password_input.value,
     confirm : profile_confirm_input.value
   }

   e.preventDefault();
   SubmitProfileEdit(config,e);
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
    e.preventDefault();
    ConfigureAndSubmit(e);
  });

}

if(submit_form){

  submit_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    ConfigureAndSubmit(e);
  });

}

if(profile_dropdown_opener){

  profile_dropdown_opener.addEventListener("click",(e)=>{
    e.preventDefault();
    ToggleDropdown(dropdown,true);
  });

}

if(main_content){

  main_content.addEventListener("click",(e)=>{

    if(isDropdownOpen){
      ToggleDropdown(dropdown,false);
    }

  });

}

exit_profile.addEventListener("click",(e)=>{
  PopulateAndSetEditProfileModal(false,null);
});
