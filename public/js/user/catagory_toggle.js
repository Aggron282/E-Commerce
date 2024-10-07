var toggle_buttons = document.getElementsByClassName("catagory_arrow");
var product_boxes = document.getElementsByClassName("product_box");

var catagories = null;
var page_counter = 0;
var increase_increment = 4;

const RenderItems = (catagory) => {

  var populate_container = document.querySelector("#_"+catagory.catagory);
  var html = ``;

  populate_container.innerHTML = "";

   for(var i = 0; i <= 3; i++) {

    var current_catagory_counter = i + catagory.counter;

     html += `
      <div class="col-3 catagorized_products_col">
        ${RenderProductBox(catagory,current_catagory_counter)}
      </div>`
 }

  populate_container.innerHTML = html;

}

const ToggleCatagories = async (page_counter,catagory) => {

  const api_options ={
    method: "POST",
    body:JSON.stringify({
      "counter":`${increase_increment}`,
      "catagory":`${catagory}`
    }),
    headers: {'Content-Type': 'application/json'}
  };

  axios.post("/catagories",api_options).then(async(res)=>{

    var items_in_catagories = await res.data.current;

    if(items_in_catagories){
      RenderItems(items_in_catagories);
    }

  });

}

const InitToggle = () => {

  for(var i = 0; i < toggle_buttons.length; i ++){

    toggle_buttons[i].addEventListener("click",async (e)=>{

      var page_counter = e.target.getAttribute("counter");
      var catagory_name = e.target.getAttribute("catagory");

      ToggleCatagories(page_counter,catagory_name);

    });

  }

}

const ExecToggle = (e) => {

  var multiplier = e.target.getAttribute("multiplier");

  if(!multiplier){
    return;
  }

  multiplier = parseInt(multiplier);

  ToggleCatagoryPage(multiplier);
  BuiltCatagoriesHTML();

}

const ToggleCatagoryPage = (multiplier) => {

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

InitToggle();
