var popup_container = document.querySelector(".popup_container")
const usd_format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function titleCase(str) {

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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function RenderPopup(message){

  if(popup_container){
      popup_container.innerHTML = (
      `<span class="popup_message popup_message--active popup_message--server ">
        ${message}
      </span>`
    );
   }

}
