var container_render = document.querySelector(".catagory_search");
var catagory_buttons = document.getElementsByClassName("navbar_user_sub_banner");

var PAGE_LIMIT = 5;
var PAGE_INCREMENT = 5;

var counter = 0;
var selected_catagory = null;

const RenderHTMLToCatagory = (items_in_catagory,catagory_name) => {

  var html = RenderCatagories(items_in_catagory,catagory_name);

  container_render.innerHTML = html;

  var catagories_arrows = document.getElementsByClassName("arrow_catagory_sub");

  for(var i =0; i < catagories_arrows.length; i++){

    catagories_arrows[i].addEventListener("click",(e)=>{
      ExecToggle(e);
    })

  }

}

const BuiltCatagoriesHTML = () =>{

  var html  = ``;
  var row = "<div class ='row'>";

  html+= row;

  for(var i =0; i <PAGE_LIMIT; i++){

    if(!selected_catagory){
      return;
    }
    if(counter + i > selected_catagory.products.length){
      break;
    }

    html += `
    <div class="col-2">
      ${RenderProductBox(selected_catagory,i)}
    </div>
    `
  }

  html+= "</div>";

  RenderHTMLToCatagory(html, titleCase(selected_catagory.catagory));

}

const GetCatagories = (catagory) => {

  axios.get("/catagories").then((res)=>{

    var data = res.data;
    catagory = titleCase(catagory);

    for(var i =0; i <data.length; i++){

      if(catagory == titleCase(data[i].catagory)){
        selected_catagory = data[i];
        counter = 0;
      }

    }

    BuiltCatagoriesHTML();

  })

}

const InitCatagories = () => {

  for(var i = 0; i < catagory_buttons.length; i++){

    catagory_buttons[i].addEventListener("click",(e)=>{

      counter = 0;

      var catagory_data = e.target.getAttribute("data");

      GetCatagories(catagory_data);
      RevealModal();

    });

  }

}

InitCatagories();
