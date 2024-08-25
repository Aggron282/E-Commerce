var toggle_buttons_elements = document.getElementsByClassName("catagory_arrow");
var product_boxes_elements = document.getElementsByClassName("product_box");

var catagories = null;

var page_counter = 0;
var increase_increment = 4;


function RenderItems(catagory){

  var name = "Name Will Be Placed Here";
  var img = "./images/catagory_3.png";
  var price = "[N/A]";
  var description = "";
  var html = ``;

  var populate_el = document.querySelector("#_"+catagory.catagory);

  populate_el.innerHTML = "";

   for(var i = 0; i <= 3; i++) {

    var current_catagory_counter = i + catagory.counter;

    if(catagory.items[current_catagory_counter])
    {
       name = catagory.items[current_catagory_counter].title.substring(0, 30) + "...";
       img = "./"+catagory.items[current_catagory_counter].thumbnail
       price = catagory.items[current_catagory_counter].price
       description = catagory.items[current_catagory_counter].description.substring(0, 100) + "...";
     }

     html += `
      <div class="col-3 no-margin-left">

       <div class= "catagory_product_box product_box--catagory width-100" catagory = ${catagory.catagory} it = ${current_catagory_counter} >

        <p class="catagory_product_text--name">${ name }</p>

        <img class="catagory_product_image margin-top-5"src = ${ img } />

         <div class="catagory_product_text_box margin-top-5">
           <p class="catagory_product_text catagory_product_text--description">${description}</p>
           <p class="catagory_product_text catagory_product_text--price">$ ${ price }</p>
              <a href = ${"/product/"+catagories[k].products[i_]._id}>
                <p class="catagory_product_detail">See Details</p>
              </a>
         </div>

        </div>

      </div>`

 }

 populate.innerHTML = html;

}

async function ToggleCatagories(page_counter,catagory) {

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

function Init(){

  for(var i = 0; i < toggle_buttons_elements.length; i ++){

    toggle_buttons_elements[i].addEventListener("click",async (e)=>{

      var page_counter_attribute = e.target.getAttribute("counter");
      var catagory_attribute = e.target.getAttribute("catagory");

      ToggleCatagories(page_counter,catagory);

    });

  }

}


Init();
