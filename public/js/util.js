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


// <div class="catagory_arrow catagory_arrow--left" catagory = <%= c %> counter = -1  >
//   <img src = "./../images/arrow.png" catagory = <%= c %> counter = -1/>
// </div>
//
// <div class="catagory_arrow catagory_arrow--right"  catagory = <%= c %> counter =1>
//   <img src = "./../images/arrow.png" catagory = <%= c %> counter =1/>
// </div>
