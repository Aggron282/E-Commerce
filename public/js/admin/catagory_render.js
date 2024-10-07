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

    var catagory = organized_products[i];
    var counter = i;
    var limit = CATAGORY_LIMIT >= catagory.products.length ?  catagory.products.length : CATAGORY_LIMIT;

    html += `<div class="row relative padding-bottom-5 products_in_catagory_row" > `
    html += RenderCatagoryTitle(catagory);

    for(var k = 0; k < limit; k++){

      var new_counter = k + organized_products[i].counter;
      var product = organized_products[i].products[k];

      html += `

      <div class="col-3 no-margin-left margin-top-2_5 admin_catagory_product_col">
        ${RenderProductBox(product,catagory,counter)}
      </div>

       ${RenderFeatureBox(product)}

      </div>`

    }

    html += RenderArrows(catagory);

    html += `</div>`;

  }

  catagory_products_admin_container.innerHTML = html;

  AddEventsToToggleArrows();

}

//----------------------------Products Organization Functions-----------
