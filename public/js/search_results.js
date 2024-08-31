var overlay_content_element = document.querySelector(".overlay_content");
var main_content_element = document.querySelector(".main_content");
// var exit_element = document.querySelector(".search_overlay_text--exit");
// var search_overlay_element = document.querySelector(".search_overlay");
var item_search_form_admin = document.querySelector(".navbar_admin_input--form");
var item_search_form = document.querySelector(".navbar_user_input--form");

var search_input_element = document.querySelector(".navbar_user_input--form");

var catagory_search_form_admin = document.querySelector(".catagory_search_form--admin");
var catagory_search_form = document.querySelector(".catagory_search_form")
// var search_overlay_row_element = document.querySelector(".search_overlay_row");

// var hasSearched = false;
// var hasChanged = false;

// var fixed_time = 1000;

//------------------------------------  Render and Build HTML  --------------------

// function BuiltItemHTML(result){
//
//   var name = result.title.substring(0, 30) + "..."
//   var url = window.location.href;
//   var num_of_slashed = url.split('/').length-1;
//   var url_img_mod = "./";
//   var img = url_img_mod+result.thumbnail
//   var price = result.price
//   var description = result.description.substring(0, 100) + "..."
//
//   if(num_of_slashed > 1){
//
//     for(var i = 0; i < num_of_slashed - 1; i++){
//       url_img_mod += "../";
//     }
//
//   }
//
//   var html =`
//     <div class="col-3 no-margin-left">
//
//     <div class= "catagory_product_box product_box--catagory width-100">
//
//       <p class="catagory_product_text--name"> ${ name } </p>
//
//       <img class="catagory_product_image" src = ${ img } />
//
//       <div class="catagory_product_text_box margin-top-5">
//         <p class="catagory_product_text catagory_product_text--description"> ${ description } </p>
//         <p class="catagory_product_text catagory_product_text--price">$ ${ price } </p>
//
//         <a href = "/product/${ result._id }" ><p class="catagory_product_detail">See Details</p></a>
//
//       </div>
//
//     </div>
//
//   </div>`
//
//   return html;
//
// }
//
// function RenderSearchProductsToHTML(){
//
//   var html = ``;
//
//   hasSearched = true;
//
//   RevealModal();
//
//   for(var i = 0; i <data.length; i ++){
//     html += BuiltItemHTML(data[i]);
//   }
//
//   search_overlay_row_element.innerHTML = html;
//
// }

//------------------------------------ Toggle Modal  --------------------
function ExitModal(){

  // search_overlay_element.classList.add("search_overlay--inactive");
//  overlay_content_element.classList.add("overlay_content--inactive");
  main_content_element.classList.add("main_content--active");

  // search_overlay_element.classList.remove("search_overlay--active");
  //overlay_content_element.classList.remove("overlay_content--active");
  main_content_element.classList.remove("main_content--inactive");

}

function RevealModal(){

  // search_overlay_element.classList.remove("search_overlay--inactive");
  //overlay_content_element.classList.remove("overlay_content--inactive");
  main_content_element.classList.remove("main_content--active");

  // search_overlay_element.classList.add("search_overlay--active");
  //overlay_content_element.classList.add("overlay_content--active");
  main_content_element.classList.add("main_content--inactive");

}

//------------------------------------ EventListeners  --------------------
if(item_search_form){

  item_search_form.addEventListener("submit",(e)=>{
      e.preventDefault();
      var search_bar_element = document.querySelector(".navbar_user_input--search");

      var input = search_bar_element.value;
      console.log(search_bar_element)

      window.location.assign(`/search/product/item=${input}/page_counter=0`);

    })

}

if(item_search_form_admin){

  item_search_form_admin.addEventListener("submit",(e)=>{
      e.preventDefault();
      var search_bar_element = document.querySelector(".navbar_admin_input--search");

      var input = search_bar_element.value;
      console.log(search_bar_element)

      window.location.assign(`/search/product/item=${input}/page_counter=0/isAdmin=true`);

    })

}

if(catagory_search_form){
  catagory_search_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    var catagory_input = document.querySelector(".catagory_search_user").value;

    window.location.assign(`/search/product/catagory=${catagory_input}/page_counter=0/isAdmin=true`);
  });
}

if(catagory_search_form_admin){

  catagory_search_form_admin.addEventListener("submit",(e)=>{
    e.preventDefault();
    var catagory_input = document.querySelector(".catagory_search_admin").value;

    window.location.assign(`/search/product/catagory=${catagory_input}/page_counter=0/isAdmin=true`);
  });

}
// exit_element.addEventListener("click",(e)=>{
//
//   hasSearched = false;
//   ExitModal();
//
// })
