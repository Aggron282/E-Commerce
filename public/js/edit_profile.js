var edit_profile = document.querySelector("#edit_profile");
var edit_profile_admin = document.querySelector("#edit_profile_admin");
var submit_form = document.querySelector(".profile_form_");
var profile_container = document.querySelector(".profile_container");
var exit_profile = document.querySelector(".exit_profile");
var submit_profile = document.querySelector(".submit_profile");
var submit_profile_admin = document.querySelector(".submit_profile_admin");

var profile_name = document.querySelector(".profile_input--name");
var profile_username = document.querySelector(".profile_input--username");
var profile_password = document.querySelector(".profile_input--password");
var profile_confirm = document.querySelector(".profile_input--confirm");

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
    document.querySelector(".profile_wrapper").classList.add("active_wr")
    profile_container.classList.add("profile_container_active");
  }
  else{
    document.querySelector(".profile_wrapper").classList.remove("active_wr")
    profile_container.classList.remove("profile_container_active");
  }

}


//-----------------------------------------------Get and Post Profile Data-----------------------------

async function PopulateProfileForm (url){

  var profile = await axios.get(url).then((response)=>{

    var data = response.data;

    profile_name.value = data.name;
    profile_username.value = data.email;
    profile_password.value = "";
    profile_confirm.value = "";

    profile = data;

  }).catch((err)=>{console.log(err)});

}

function SubmitProfileEdit({name,username,password,confirm},e){

  e.preventDefault();

  if(password.length < 4){
    alert("Password Too Short");
    return;
  }

  if(confirm == password){
    e.submit();
  }
  else{
    alert("Passwords Do Not Match")
  }

}


//-----------------------------------------------Add EventListeners to Elements ------------------------
if(edit_profile){

  edit_profile.addEventListener("click",(e)=>{
    PopulateAndSetEditProfileModal(null,"/user/profile/data");
  });

}

if(edit_profile_admin){

  edit_profile_admin.addEventListener("click",(e)=>{
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

      SubmitProfileEdit(config,submit_form);

  });

}

if(submit_profile_admin){

  submit_profile_admin.addEventListener("click",(e)=>{

    e.preventDefault();

    var config = {
        name: profile_name.value,
        username: profile_username.value,
        password: profile_password.value,
        confirm : profile_confirm.value
      }

      SubmitProfileEdit(config,submit_form);

  });

}

exit_profile.addEventListener("click",(e)=>{
  PopulateAndSetEditProfileModal(false,null);
});