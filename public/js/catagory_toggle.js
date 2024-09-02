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
  var discount_price=''
  var populate_el = document.querySelector("#_"+catagory.catagory);
  var cross = "";
  populate_el.innerHTML = "";

   for(var i = 0; i <= 3; i++) {

    var current_catagory_counter = i + catagory.counter;
    console.log(current_catagory_counter);
    if(catagory.products[current_catagory_counter])
    {
       name = catagory.products[current_catagory_counter].title.substring(0, 30) + "...";
       img = "/images/"+catagory.products[current_catagory_counter].thumbnail
       price = catagory.products[current_catagory_counter].price
       description = catagory.products[current_catagory_counter].description.substring(0, 100) + "...";
       discount_price = parseFloat(price - (price * (catagory.products[current_catagory_counter].discount / 100)))
       cross = catagory.products[current_catagory_counter].discount > 0 ? "cross-out" : ""
       discount_price = Math.round(discount_price * 100) / 100

     }

     html += `
      <div class="col-3 catagorized_products_col">

        <a href = ${"/product/"+catagory.products[current_catagory_counter]._id} >

           <div class= "catagory_product_box product_box--catagory width-100" catagory = ${catagory.catagory} it = ${current_catagory_counter} >

            <p class="catagory_product_text--name">${ name }</p>

            <img class="catagory_product_image margin-top-5"src = ${ img } />

             <div class="catagory_product_text_box margin-top-5">
               <p class="catagory_product_text catagory_product_text--price ${cross}">$ ${ price }</p>

                    <p class="catagory_product_text catagory_product_text--price ">$ ${ discount_price} </p>

             </div>

            </div>

        </a>

      </div>`

 }

 populate_el.innerHTML = html;

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

      ToggleCatagories(page_counter,catagory_attribute);

    });

  }

}


Init();
