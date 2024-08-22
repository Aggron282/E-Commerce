var add_product = document.getElementsByClassName("add_p");
var main_interface = document.querySelector(".main_interface");
var modal_wrapper = document.querySelector(".modal_wrapper");
var edit_button = document.getElementsByClassName("edit_button_p");
var delete_button_p = document.getElementsByClassName("delete_button_p");
var product_form = document.querySelector("#product_form");
var exit_modal = document.querySelector(".exit_modal");
var edit_delete = document.getElementsByClassName("edit_delete_container");
var edit_delete_button  =  document.querySelector(".edit_delete_p");
var catagory_products_admin_container = document.querySelector(".main_interface--products_container");

var config = null;

var CATAGORY_LIMIT = 5;
var canEdit = false;
var isModalOn = false;

var organized_products = [];

//----------------------------Init-----------
async function Init(){

  organized_products = await OrganizeProducts();

  if(catagory_products_admin_container){
    catagory_products_admin_container.innerHTML = "";
    RenderProductCatagories();
  }

  if(canEdit){
    AddEventToEditButtons();
  }

  for(var i =0; i < add_product.length; i++){

    add_product[i].addEventListener("click",()=>{
      ToggleModal(true);
      SetForm("/admin/product/add");
    });

  }

}

//----------------------------Form Edit Functions-----------
function SubmitForm(){

  var title_ = document.querySelector(".name_input");
  var price_ = document.querySelector(".price_input");
  var description_ = document.querySelector(".description_input");
  var catagory_ = document.querySelector(".catagory_input");
  var quantity_ = document.querySelector(".quantity_input");
  var discount_ = document.querySelector(".discount_input");
  var banner_ = document.querySelector(".banner_input");
  var id_ = document.querySelector(".id_input");
  var thumbnail_ = document.querySelector(".image_input");
  var thumbnail_value = "";

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
    var id_ = document.querySelector(".id_input");
    var thumbnail_ = document.querySelector(".image_input");
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

async function RenderProductCatagories(){

  var html = ``;

  for(var i =0; i < organized_products.length; i++){

    html+= `<div class="row" style="padding-bottom:5%;position:relative"> `

    html += `<div class="catagory_products"style="padding-bottom:0%;" >
      <p class="catagory_name"> ${organized_products[i].catagory} </p>
    </div>
    `
    for(var k = 0; k < CATAGORY_LIMIT; k++){

      var new_counter = k + organized_products[i].counter;

      if(new_counter >= organized_products[i].products.length){
        break;
      }

      html += `

      <div class="sub_catagory_container_item col-2" style="margin-top:0%;">

        <div class="inner_container--admin-product">

          <a href = "/admin/product/detail/${organized_products[i].products[new_counter]._id}">

          <p class="title">${organized_products[i].products[new_counter].title.substring(0, 55) + "..."}</p>

          <div class="height_container">
            <img class="item_img" src = ${organized_products[i].products[new_counter].thumbnail} />
          </div>

          <p class="price price--admin">$${organized_products[i].products[new_counter].price}.99</p>

          </a>
          </div>

          <div class="edit_delete_container">

            <div class="inner_edit edit_button_p"  _id = "${organized_products[i].products[new_counter]._id}">
              Edit
            </div>

            <div class="inner_edit delete_button_p" _id = "${organized_products[i].products[new_counter]._id}">
              Delete
            </div>

          </div>

      </div>`

    }

    html += `
    <div class="arrow_catagory_sub_container arrow_catagory_sub_container--admin">
      <div class="arrow_catagory_sub arrow_catagory_sub--left arrow_catagory_sub--left--admin " multiplier = "-1" catagory = "${organized_products[i].catagory}">
        <img src = "./images/arrow.png"  multiplier = "-1"  catagory = "${organized_products[i].catagory}" />
      </div>
      <div class="arrow_catagory_sub arrow_catagory_sub--right arrow_catagory_sub--right--admin" multiplier ="1" catagory =  "${organized_products[i].catagory}" >
        <img src = "./images/arrow.png" multiplier = "1" catagory =  "${organized_products[i].catagory}"  />
      </div>
    </div>`

    html += `</div>`;

  }

  catagory_products_admin_container.innerHTML = html;

  var arrow_catagory_sub = document.getElementsByClassName("arrow_catagory_sub");

    for(var i =0; i < arrow_catagory_sub.length; i++){

      arrow_catagory_sub[i].addEventListener("click",(e)=>{
        ToggleCatagoryProducts(e);
      });

    }

}

//----------------------------Products Organization Functions-----------
async function OrganizeProducts(){

  var organized_products = [];
  var get_products = await axios.get("/admin/products/all");
  var products = get_products.data;
  var catagories = [];

  for(var i = 0; i < products.length; i++){

      if(catagories.length <= 0){
        catagories.push(products[i].catagory);
      }

      var isFound = false

      for(var l = 0; l < catagories.length; l++){

        if(catagories[l] == products[i].catagory){
          isFound = true;
        }

      }

      if(!isFound){
          catagories.push(products[i].catagory);
      }

  }

    for(var i = 0; i < products.length; i++){

      var isFound = false;

      var config = {
        counter:0,
        catagory:products[i].catagory,
        products:[products[i]]
      }

      if(organized_products.length <=0){
        organized_products.push(config);
        isFound = true;
      }

      for(var k =0; k < organized_products.length; k++){

          if(products[i].catagory == organized_products[k].catagory){
            isFound = true;
            organized_products[k].products.push(products[i]);
          }

      }

      if(!isFound){
        organized_products.push(config);
      }

    }

   return organized_products;

}

function ToggleCatagoryProducts(e){

  var multiplier = parseInt(e.target.getAttribute("multiplier"));
  var catagory = e.target.getAttribute("catagory");

  for(var c = 0; c < organized_products.length; i++){

      if(catagory == organized_products[i].catagory){

          var counter = multiplier;
          var new_organized_products = [...organized_products];

          new_organized_products[i].counter += multiplier * CATAGORY_LIMIT;

          if(new_organized_products[i].counter  + CATAGORY_LIMIT> organized_products[i].products.length){
              new_organized_products[i].counter = 0;
          }
          else if( new_organized_products[i].counter <= 0){
              new_organized_products[i].counter = 0;
          }

          organized_products = new_organized_products;

          break;

      }

  }

  RenderProductCatagories();

}

//----------------------------Toggle Modal and Edit Functions-----------
function ToggleCanEdit(){

  canEdit = !canEdit;

  if(canEdit){
    edit_delete_button.classList.add("underline_active");
  }
  else{
    edit_delete_button.classList.remove("underline_active");
  }

  AddEditAndDeleteFeature(canEdit);

}

function ToggleEdit(canEdit_){
  canEdit = canEdit_;
}

function ToggleModal(isOn){

  if(isOn){
    modal_wrapper.classList.add("active");
    modal_wrapper.classList.remove("inactive");
    main_interface.classList.remove("active");
    main_interface.classList.add("inactive");
  }
  else{
    modal_wrapper.classList.add("inactive");
    modal_wrapper.classList.remove("active");
    main_interface.classList.remove("inactive");
    main_interface.classList.add("active");
  }

}

//----------------------------Add Events To Element Functions-----------
function AddEventToEditButtons(){

  for(var i =0; i < edit_button.length; i++){

    edit_button[i].addEventListener("click",async (e)=>{

        var id = e.target.getAttribute('_id');

        var product = await axios.post("/admin/product/one/",{_id:id});

        product = product.data;

        PopulateModal(product,"/admin/product/edit");

    });

  }

  for(var i =0; i < delete_button_p.length; i++){

    delete_button_p[i].addEventListener("click",async (e)=>{

      var prompt_requirement = 'DELETE';
      var product_prompt = prompt(`Type ${prompt_requirement} to delete product (There is no way to add product back once deleted)`);

      if(product_prompt == prompt_requirement){

        var id = e.target.getAttribute('_id');
        var product = await axios.post("/product/delete",{_id:id}).catch((err)=>{console.log(err)});

        if(product){
          alert("Deleted Product");
          Init();
        }

      }
      else{
        alert("Canceled");
      }

    });

  }

}

function AddEditAndDeleteFeature(canEdit){

  for(var i =0; i < edit_delete.length; i++){

    if(canEdit){
      edit_delete[i].classList.add("edit_delete_container_active");
    }
    else{
      edit_delete[i].classList.remove("edit_delete_container_active");
    }

  }

  if(canEdit){
    AddEventToEditButtons();
  }

}

exit_modal.addEventListener("click",()=>{
  ToggleModal(false);
});

edit_delete_button.addEventListener("click",()=>{
  ToggleModal(false);
  ToggleCanEdit();
});

Init();
