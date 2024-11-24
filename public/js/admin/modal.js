var main_interface = document.querySelector(".main_content");
var product_form = document.querySelector("#product_form");
var exit_modal = document.querySelector(".exit_modal");
var modal_wrapper = document.querySelector(".add_product_modal");

function ToggleModal(isOn){

  if(isOn){
    modal_wrapper.classList.remove("add_product_modal--inactive");
    main_interface.classList.remove("main_content--active");
  }
  else{
    modal_wrapper.classList.add("add_product_modal--inactive");
    main_interface.classList.add("main_content--active");
  }

}

//----------------------------Populate and Render Functions-----------
function PopulateModal({_id,title,price,description,thumbnail,quantity,discount,banner,catagory},form){

    var title_ = document.querySelector(".name_input");
    var price_ = document.querySelector(".price_input");
    var description_ = document.querySelector(".description_input");
    var catagory_ = document.querySelector(".catagory_input");
    var quantity_ = document.querySelector(".quantity_input");
    var discount_ = document.querySelector(".discount_input");
    var banner_ = document.querySelector(".banner_input");
    var thumbnail_ = document.querySelector(".image_input");
    var id_ = document.querySelector(".id_input");

    var thumbnail_value = "";

    ToggleCanEdit(false);

    title_.value = title;
    price_.value = price;
    id_.value = _id;
    description_.value = description;
    catagory_.value  = catagory;
    quantity_.value = quantity;
    discount_.value = discount;
    banner_.value = banner;

    if(thumbnail){
      thumbnail_value = thumbnail;
    }

    var config = {
      banner:banner,
      discount:discount,
      catagory:catagory,
      title:title,
      _id:_id,
      price:price,
      quantity:quantity,
      description:description,
      thumbnail:thumbnail_value
    }

    ToggleModal(true);

    SetForm(form);

}

exit_modal.addEventListener("click",()=>{
  ToggleModal(false);
});
