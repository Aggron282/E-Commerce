var popup_container = document.querySelector(".popup_container")

const usd_format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const titleCase = (str) => {

  if(!str){
    return "";
  }

  if(str.length < 0){
    return "";
  }

  var splitStr = str.toLowerCase().split(' ');

  for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  return splitStr.join(' ');

}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const RenderPopup = (message) => {

  if(popup_container){
      popup_container.innerHTML = (
      `<span class="popup_message popup_message--active popup_message--server ">
        ${message}
      </span>`
    );
   }

}

const CreatePopup = (message) => {

  var element = document.createElement("div");

  element.classList.add("popup");
  element.innerHTML = message;

  document.body.appendChild(element);

  setTimeout(()=>{
    element.classList.add("popup_back");
  },3000)

}

const Delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const DelayedRefresh = async (time) => {
  await Delay(time);
  window.location.assign(window.location.href)
}

const DelayedRedirect = async (time,url) => {
  await Delay(time);
  window.location.assign(url)
}

const  CreateFormData = (form_element)=>{

  const formData = new FormData(form_element);

  var data = {};

  for (const [key, value] of formData) {
    data[key] = value;
  }

  return data;

}

function SetForm(form){
  console.log(form)
  var id = form.getAttribute("id");
  var button_id = form.getAttribute("button_id");
  var redirect = form.getAttribute("redirect");
  var form_button = document.getElementById(button_id);
  var action = form.getAttribute("action");

  async function Submit(){

      var data = CreateFormData(form)
      console.log(data);
      if(data){

        axios.post(action,data).then((response)=>{

          if(response.status == 200){

            if(redirect || redirect.contains("/")){
              window.location.assign(redirect);
            }else{
              CreatePopup("Submitted")
            }

          }
          else{
            CreatePopup("Could Not Submit")
          }

        }).catch((err)=>{
          CreatePopup("Could Not Submit")
        });

    }

  }

    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      Submit();
    });

    form_button.addEventListener("click",(e)=>{
      e.preventDefault();
      Submit();
    });

}
