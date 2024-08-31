var add_product = document.getElementsByClassName("add_p");

var main_interface = document.querySelector(".main_content");
var modal_wrapper = document.querySelector(".add_product_modal");
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

    add_product[i].addEventListener("click",(e)=>{
      console.log(e.target)
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

    html+= `<div class="row relative padding-bottom-5 products_in_catagory_row" > `

    html += `<div class="catagory_products_admin" >
      <p class="catagory_name"> ${organized_products[i].catagory} </p>
    </div>
    `
    for(var k = 0; k < CATAGORY_LIMIT; k++){

      var new_counter = k + organized_products[i].counter;

      if(new_counter >= organized_products[i].products.length){
        break;
      }
      console.log(organized_products[i].products[k])
      var discount_price = parseFloat(organized_products[i].products[k].price - (organized_products[i].products[k].price * (organized_products[i].products[k].discount / 100)));
      discount_price = Math.round(discount_price * 100) / 100;
      html += `


      <div class="col-3 no-margin-left margin-top-2_5 ">
        <div class= "catagory_product_box product_box--catagory width-100 relative"  catagory = "${ organized_products[i].catagory.toLowerCase() }" it = "${k}"  >

          <p class="catagory_product_text--name">${organized_products[i].products[k].title}</p>

          <img class="catagory_product_image_admin margin-top-5" src = '${"/images/"+organized_products[i].products[k].thumbnail.replace(/ /g,'')}' />

          <div class="catagory_product_text_box margin-top-5">

            <p class="catagory_product_text catagory_product_text--price ${discount_price < organized_products[i].products[k].price ? "cross-out" : ""}">$ ${ organized_products[i].products[k].price}</p>
            <p class="catagory_product_text catagory_product_text--discount ">$ ${ discount_price + " (" + organized_products[i].products[k].discount + "% Discount)"  }</p>
            <p class="catagory_product_text catagory_product_text--quantity "> Qty: ${ organized_products[i].products[k].quantity} </p>
            <p class="catagory_product_text catagory_product_text--description">${organized_products[i].products[k].description.substring(0,50)+"..."}</p>

            <a href =${ "/admin/product/"+organized_products[i].products[k]._id} >
              <p class="catagory_product_detail">See Details</p>
            </a>

        </div>

     </div>

          <div class="edit_delete_container edit_delete_container--inactive ">

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
    <div class="arrow_catagory_container arrow_catagory_container--admin">
      <div class="arrow_catagory arrow_catagory--left arrow_catagory--left--admin " multiplier = "-1" catagory = "${organized_products[i].catagory}">
        <img src = "./images/arrow.png"  multiplier = "-1"  catagory = "${organized_products[i].catagory}" />
      </div>
      <div class="arrow_catagory arrow_catagory--right arrow_catagory--right--admin" multiplier ="1" catagory =  "${organized_products[i].catagory}" >
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

  AddEditAndDeleteFeature(canEdit);

}

function ToggleEdit(canEdit_){
  canEdit = canEdit_;
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

  console.log(modal_wrapper)


}

//----------------------------Add Events To Element Functions-----------
function AddEventToEditButtons(){

  for(var i =0; i < edit_button.length; i++){

    edit_button[i].addEventListener("click",async (e)=>{

        var id = e.target.getAttribute('_id');

        var product = await axios.post("/admin/product/one/",{_id:id});

        product = product.data;

        PopulateModal(product,"/admin/product/edit");
        PopulateContent(product.title,product.catagory,product.price,product.discount,product.thumbnail,product.description);

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
      edit_delete[i].classList.remove("edit_delete_container--inactive");
      edit_delete[i].classList.add("edit_delete_container--active");
    }
    else{
      edit_delete[i].classList.add("edit_delete_container--inactive");
      edit_delete[i].classList.remove("edit_delete_container--active");
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


var name_content = document.querySelector(".content_text--title");
var price_content = document.querySelector(".content_text--price");
var discount_content = document.querySelector(".content_text--discount");
var catagory_content = document.querySelector(".content_text--catagory");
var description_content = document.querySelector(".content_text--description");
var image_content = document.querySelector(".content_img");

function PopulateContent(name,catagory,price,discount,thumbnail,description){

  if(discount > 0){
    price_content.classList.add("cross-out");
  }else{
    price_content.classList.remove("cross-out");
  }

  var discount_price = parseFloat(price - (price * (discount / 100)));

  discount_price = Math.round(discount_price * 100) / 100;

  name_content.innerHTML = name;
  catagory_content.innerHTML = catagory;
  price_content.innerHTML = "$"+price;
  discount_content.innerHTML = "$"+discount_price;
  image_content.setAttribute("src","/images/"+thumbnail);
  description_content.innerHTML = description;
}

function UpdateAddProductContent(element,value){
  console.log(element,value);
  element.innerHTML = value;
}

document.querySelector(".name_input").addEventListener("keyup",(e)=>{
  var value = e.target.value;
  if(value.length <= 0){
    value = "Name of Your Product";
  }
  UpdateAddProductContent(name_content,value);
});

document.querySelector(".price_input").addEventListener("keyup",(e)=>{
  var value = e.target.value;

  if(value.length > 0){
    value = Math.abs(parseInt(value));
  }else{
    value = 0;
  }
  e.target.value = value;
  if(e.target.value == NaN){
    e.target.value  = 0;
    value = 0;
  }
  UpdateAddProductContent(price_content,"$"+value);
});

document.querySelector(".discount_input").addEventListener("keyup",(e)=>{
  var value = e.target.value;

  if(value.length > 0){
    value = Math.abs(parseInt(value));
  }else{
    value = 0;
  }

  e.target.value = value;

  if(e.target.value == NaN){
    e.target.value  = 0;
    value = 0;
  }

  var price = 0;

  if(document.querySelector(".price_input").value > 0){
    price = document.querySelector(".price_input").value;
  }

    if(value > 0){
      price_content.classList.add("cross-out");
    }else{
      price_content.classList.remove("cross-out");
    }

  var discount_price = parseFloat(price - (price * (value / 100)));
  discount_price = Math.round(discount_price * 100) / 100;
  UpdateAddProductContent(discount_content,"$"+discount_price );

});

document.querySelector(".catagory_input").addEventListener("keyup",(e)=>{

  var value = e.target.value;
  if(value.length <= 0){
    value = "Catagory";
  }
  UpdateAddProductContent(catagory_content,value);
});

document.querySelector(".description_input").addEventListener("keyup",(e)=>{
  var value = e.target.value;
  if(value.length <= 0){
    value = "Enter Description";
  }
  UpdateAddProductContent(description_content,value);
});
