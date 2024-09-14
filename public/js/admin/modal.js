var main_interface = document.querySelector(".main_content");
var product_form = document.querySelector("#product_form");
var exit_modal = document.querySelector(".exit_modal");
var modal_wrapper = document.querySelector(".add_product_modal");

function SubmitForm(){

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
  var config = null;

  if(config){

    if(config.thumbnail){
      thumbnail_value = config.thumbnail;
    }
    else{
      thumbnail_value = thumbnail_.value;
    }

  }
  else{
      thumbnail_value = thumbnail_.value;
  }

   config = {
    banner:banner_.value,
    discount:discount_.value,
    catagory:catagory_.value,
    title:title_.value,
    _id:id_.value,
    price:price_.value,
    quantity:quantity_.value,
    description:description_.value,
    thumbnail:thumbnail_value
  }

  var FormErrors = CheckForm(config);

  if(FormErrors.isErr){
    alert(FormErrors.err_msg);
    return null;
  }
  else{
    return config;
  }

}

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

function CheckForm({banner,discount,catagory,title,_id,price,quantity,description,thumbnail}){

    var err_msg = "Cannot Add Product for Following Reasons: \n";
    var isErr = false;

    if(catagory.length <= 0){
      err_msg+= " Catagory field is empty \n";
      isErr= true;
    }
    if(price.length <= 0){
      err_msg+= " Price field is empty \n";
      isErr= true;
    }
    if(title.length <= 2){
      err_msg+= " Title field is too small \n";
      isErr= true;
    }
    if(thumbnail.length <= 0){
      err_msg+= " Thumbnail field is empty \n";
      isErr= true;
    }
    if(description.length <= 0){
      err_msg+= " Description field is empty \n";
      isErr= true;
    }
    if(quantity.length <= 0){
      err_msg+= " Quantity field is empty \n";
      isErr= true;
    }

    return {
      isErr:isErr,
      err_msg:err_msg
    }

}

function SetForm(action){

    var form = document.querySelector("#product_form");
    var form_button = document.querySelector(".add_product_btn");

    form.setAttribute("action",action);

    form.addEventListener("submit",(e)=>{

      e.preventDefault();

      var form_data = SubmitForm();

      if(form_data){
        form.submit();
      }

    });

    form_button.addEventListener("click",(e)=>{

      e.preventDefault();

      var form_data = SubmitForm();

      if(form_data){
        form.submit();
      }

    });

}

//----------------------------Populate and Render Functions-----------
function PopulateModal({_id,title,price,description,thumbnail,quantity,discount,banner,catagory},url){

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

    config = {
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

    SetForm(url);

}

exit_modal.addEventListener("click",()=>{
  ToggleModal(false);
});
