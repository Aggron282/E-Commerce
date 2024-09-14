var catagory_products_admin_container = document.querySelector(".main_interface--products_container");
var main_interface = document.querySelector(".main_content");

const CATAGORY_LIMIT = 5;

var organized_products = [];


const InitCatagories = async () => {

  organized_products = await OrganizeProducts();

  if(catagory_products_admin_container){

   catagory_products_admin_container.innerHTML = "";
   RenderProductCatagories();

  }

}

const ToggleCatagoryProducts = (e) => {

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

const RenderProductCatagories = async () => {

  var html = ``;

  for(var i =0; i < organized_products.length; i++){

    html+= `<div class="row relative padding-bottom-5 products_in_catagory_row" > `

    html += `<div class="catagory_products_admin" >
      <p class="catagory_name"> ${organized_products[i].catagory} </p>
    </div>`

    for(var k = 0; k < CATAGORY_LIMIT; k++){

      var new_counter = k + organized_products[i].counter;

      if(new_counter >= organized_products[i].products.length){
        break;
      }

      var discount_price = parseFloat(organized_products[i].products[k].price - (organized_products[i].products[k].price * (organized_products[i].products[k].discount / 100)));

      discount_price = Math.round(discount_price * 100) / 100;

      html += `

      <div class="col-3 no-margin-left margin-top-2_5 admin_catagory_product_col">

        <div class= "catagory_product_box product_box--catagory width-100 relative "style="z-index:0;"  catagory = "${ organized_products[i].catagory.toLowerCase() }" it = "${k}"  >

          <p class="catagory_product_text--name">${organized_products[i].products[k].title.substring(0,50)}</p>

          <img class="catagory_product_image_admin margin-top-5" src = '${"/images/"+organized_products[i].products[k].thumbnail.replace(/ /g,'')}' />

          <div class="catagory_product_text_box margin-top-5">

            <p class="catagory_product_text catagory_product_text--price ${discount_price < organized_products[i].products[k].price ? "cross-out" : ""}">$ ${ organized_products[i].products[k].price}</p>
            <p class="catagory_product_text catagory_product_text--discount ">$ ${ discount_price + " (" + organized_products[i].products[k].discount + "% Discount)"  }</p>
            <p class="catagory_product_text catagory_product_text--quantity "> Qty: ${ organized_products[i].products[k].quantity} </p>


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
const OrganizeProducts = async () => {

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
