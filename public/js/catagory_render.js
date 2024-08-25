var container_render = document.querySelector(".catagory_search");
var catagory_buttons = document.getElementsByClassName("navbar_user_sub_banner");

var PAGE_LIMIT = 5;
var PAGE_INCREMENT = 5;

var counter = 0;

var selected_catagory = null;


function RenderHTMLToCatagory(catagories,catagory_name){

  var render_html =  `
  <div class="catagory_container">
   <p class="catagory_name"> ${catagory_name} </p>
    <div>
      ${catagories}
    </div>
    <div class="arrow_catagory_container">
    <div class="arrow_catagory arrow_catagory--left " multiplier = "1">
      <img src = "./images/arrow.png"  multiplier = "1"/>
    </div>
    <div class="arrow_catagory arrow_catagory--right " multiplier ="-1">
      <img src = "./images/arrow.png" multiplier = "-1" />
    </div>
    </div>
  </div>
`

  container_render.innerHTML = render_html;

  var catagories_arrows = document.getElementsByClassName("arrow_catagory_sub");

  for(var i =0; i <catagories_arrows.length; i++){

    catagories_arrows[i].addEventListener("click",(e)=>{

      var multiplier = e.target.getAttribute("multiplier");

      multiplier = parseInt(multiplier);

      ToggleCatagoryPage(multiplier);
      BuiltCatagoriesHTML();

    })

  }

}

function ToggleCatagoryPage(multiplier){

    if(!selected_catagory){
      return;
    }
    else{

      counter += PAGE_INCREMENT * multiplier;
      page_count = Math.floor(selected_catagory.items.length  / PAGE_INCREMENT);

      if(counter >= page_count - 1){
        counter = 0;
      }

      if(counter < 0){

        if(page_count > 0)
        {
          counter = Math.floor(selected_catagory.items.length  / PAGE_INCREMENT);
        }
        else{
          counter = 0;
        }

      }

    }

}

function BuiltCatagoriesHTML(){

  var html  = ``;
  var row = "<div class ='row'>";

  html+= row;

  for(var i =0; i <PAGE_LIMIT; i++){

    if(counter + i > selected_catagory.products.length){
      break;
    }

    var _id = selected_catagory.products[i]._id;
    var new_description = selected_catagory.products[i].title.substring(0, 55) + "...";

    html += `
    <div class="col-2">

      <div class= "catagory_product_box product_box--catagory width-100" catagory = ${selected_catagory.catagory} i = ${selected_catagory.counter} >

        <p class="catagory_product_text--name">${new_description}</p>
        <div class="catagory_product_image_container">
          <img class="catagory_product_image" src = ${selected_catagory.products[counter + i].thumbnail} />
        </div>
        <p class="catagory_product_text">$${selected_catagory.products[counter + i].price}.99</p>
        <a href = "/product/${_id}">  <button class="catagory_product_detail">See Details</button> </a>

      </div>

    </div>
    `
  }

  html+= "</div>";

  RenderHTMLToCatagory(html, titleCase(selected_catagory.catagory));

}

function GetCatagories(catagory){

  axios.get("/catagories").then((res)=>{

    var data = res.data;
    var mod_catagory = titleCase(catagory);

    for(var i =0; i <data.length; i++){

      if(titleCase(catagory) == titleCase(data[i].catagory)){
        selected_catagory = data[i];
        counter = 0;
      }

    }

    console.log(selected_catagory);
    
    BuiltCatagoriesHTML();

  })

}

function Init(){

  for(var i = 0; i < catagory_buttons.length; i++){

    catagory_buttons[i].addEventListener("click",(e)=>{

      counter = 0;

      var catagory_name = e.target.getAttribute("data");

      GetCatagories(catagory_name);
      RevealModal();

    });

  }

}

Init();
