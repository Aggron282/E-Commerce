var container_render = document.querySelector(".catagory_search");
var catagory_buttons = document.getElementsByClassName("sub_catagory");
var PAGE_LIMIT = 5;
var PAGE_INCREMENT = 5;
var counter = 0;
var selected_catagory = null;


var RenderHTMLToCatagory = (catagories,catagory_name) =>{

  var render_html =  `
  <div class="catagory_container_sub">
   <p class="catagory_name"> ${catagory_name} </p>
    <div>
      ${catagories}
    </div>
    <div class="arrow_catagory_sub_container">
    <div class="arrow_catagory_sub arrow_catagory_sub--left " multiplier = "1">
      <img src = "./images/arrow.png"  multiplier = "1"/>
    </div>
    <div class="arrow_catagory_sub arrow_catagory_sub--right " multiplier ="-1">
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
      RenderCatagories();

    })

  }

}

for(var i = 0; i < catagory_buttons.length; i++){

  catagory_buttons[i].addEventListener("click",(e)=>{

    var catagory_name = e.target.getAttribute("data");

    GetCatagories(catagory_name);
    counter = 0;
    RevealModal();


  });

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

    console.log(counter);

}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function RenderCatagories(){

  var html  = ``;
  var row = "<div class ='row'>";

  html+= row;

  for(var i =0; i <PAGE_LIMIT; i++){

    if(counter + i > selected_catagory.items.length){
      break;
    }

    var _id = selected_catagory.items[i]._id;
    var new_description = selected_catagory.items[i].title.substring(0, 55) + "...";

    html += `
    <div class="sub_catagory_container_item col-2">
      <p class="title">${new_description}</p>
      <div class="height_container">
        <img class="item_img" src = ${selected_catagory.items[counter + i].thumbnail} />
      </div>
      <p class="price">$${selected_catagory.items[counter + i].price}.99</p>
      <a href = "/product/${_id}">  <button class="product_detail_catagory">See Details</button> </a>
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

    RenderCatagories();

  })

}
