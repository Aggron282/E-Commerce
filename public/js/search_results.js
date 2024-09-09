var overlay_content_element = document.querySelector(".overlay_content");
var main_content_element = document.querySelector(".main_content");

var item_search_form_admin = document.querySelector(".navbar_admin_input--form");
var item_search_form = document.querySelector(".navbar_user_input--form");
var search_input_element = document.querySelector(".navbar_user_input--form");

var catagory_search_form_admin = document.querySelector(".catagory_search_form--admin");
var catagory_search_form = document.querySelector(".catagory_search_form")


//------------------------------------ Toggle Modal  --------------------
function ExitModal(){

  main_content_element.classList.add("main_content--active");
  main_content_element.classList.remove("main_content--inactive");

}

function RevealModal(){

  main_content_element.classList.remove("main_content--active");
  main_content_element.classList.add("main_content--inactive");

}

//------------------------------------ EventListeners  --------------------
if(item_search_form){

  item_search_form.addEventListener("submit",(e)=>{

      e.preventDefault();

      var search_bar_element = document.querySelector(".navbar_user_input--search");
      var input = search_bar_element.value;

      window.location.assign(`/search/product/item=${input}/page_counter=0/isAdmin=false`);

    })

}

if(item_search_form_admin){

  item_search_form_admin.addEventListener("submit",(e)=>{

      e.preventDefault();

      var search_bar_element = document.querySelector(".navbar_admin_input--search");
      var input = search_bar_element.value;

      window.location.assign(`/search/product/item=${input}/page_counter=0/isAdmin=true`);

    })

}

if(catagory_search_form){

  catagory_search_form.addEventListener("submit",(e)=>{

    e.preventDefault();

    var catagory_input = document.querySelector(".catagory_search_user").value;

    window.location.assign(`/search/product/catagory=${catagory_input}/page_counter=0/isAdmin=false`);

  });

}

if(catagory_search_form_admin){

  catagory_search_form_admin.addEventListener("submit",(e)=>{

    e.preventDefault();

    var catagory_input = document.querySelector(".catagory_search_admin").value;

    window.location.assign(`/search/product/catagory=${catagory_input}/page_counter=0/isAdmin=true`);

  });

}
