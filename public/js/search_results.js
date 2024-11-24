var overlay_content_element = document.querySelector(".overlay_content");
var main_content_element = document.querySelector(".main_content");

var item_search_form_admin = document.querySelector(".navbar_admin_input--form");
var item_search_form = document.querySelector(".navbar_user_input--form");
var search_input_element = document.querySelector(".navbar_user_input--form");

var catagory_search_form_admin = document.querySelector(".catagory_search_form--admin");
var catagory_search_form = document.querySelector(".catagory_search_form");

const search_item_query = "item";
const search_catagory_query = "catagory";

const navbar_search_input_user_class_name = "navbar_user_input--search";
const navbar_catagory_input_user_class_name = "catagory_search_user";
const navbar_search_input_admin_class_name = "navbar_admin_input--search";
const navbar_catagory_search_admin_class_name = "catagory_search_admin";

//------------------------------------ Toggle Modal  --------------------
const ExitModal = () => {
  main_content_element.classList.add("main_content--active");
  main_content_element.classList.remove("main_content--inactive");
}

const RevealModal = () => {
  main_content_element.classList.remove("main_content--active");
  main_content_element.classList.add("main_content--inactive");
}

const SubmitSearch = (element_class,isAdmin,type) => {

  var search_bar_element = document.querySelector("."+element_class);
  var input = search_bar_element.value.length > 0 ? search_bar_element.value.length : "none";
  var isAdmin = isAdmin ? true : false;
  
  window.location.assign(`/search/product/${type}=${input}/page_counter=0/isAdmin=${isAdmin}`);

}

//------------------------------------ EventListeners  --------------------

if(item_search_form){

    item_search_form.addEventListener("submit",(e)=>{
      e.preventDefault();
      SubmitSearch(navbar_search_input_user_class_name,false,search_item_query);
    });

}

if(item_search_form_admin){

    item_search_form_admin.addEventListener("submit",(e)=>{
      e.preventDefault();
      SubmitSearch(navbar_search_input_admin_class_name,true,search_item_query);
    });

}

if(catagory_search_form){

  catagory_search_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    SubmitSearch(navbar_catagory_input_user_class_name,false,search_catagory_query);
  });

}

if(catagory_search_form_admin){

  catagory_search_form_admin.addEventListener("submit",(e)=>{
    e.preventDefault();
    SubmitSearch(navbar_catagory_search_admin_class_name,true,search_catagory_query);
  });

}
