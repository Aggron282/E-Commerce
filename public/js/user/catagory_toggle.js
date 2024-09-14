var toggle_buttons = document.getElementsByClassName("catagory_arrow");
var product_boxes = document.getElementsByClassName("product_box");

var catagories = null;
var page_counter = 0;
var increase_increment = 4;

const RenderItems = (catagory) => {

  var populate_container = document.querySelector("#_"+catagory.catagory);

  var html = ``;

  var name = "Name Will Be Placed Here";
  var img = "./images/catagory_3.png";
  var price = "[N/A]";
  var description = "";
  var discount_price=''
  var cross_class = "";

  populate_container.innerHTML = "";

   for(var i = 0; i <= 3; i++) {

    var current_catagory_counter = i + catagory.counter;

    if(catagory.products[current_catagory_counter])
    {

       var product = catagory.products[current_catagory_counter];

       name = product.title.substring(0, 30) + "...";
       img = "/images/"+product.thumbnail
       price = product.price
       description = product.description.substring(0, 100) + "...";
       discount_price = parseFloat(price - (price * (product.discount / 100)))
       cross_class = product.discount > 0 ? "cross-out" : ""
       discount_price = Math.round(discount_price * 100) / 100

     }

     html += `
      <div class="col-3 catagorized_products_col">

        <a href = ${"/product/"+product._id} >

           <div class= "catagory_product_box product_box--catagory width-100" catagory = ${catagory.catagory} it = ${current_catagory_counter} >

            <p class="catagory_product_text--name">${ name }</p>

            <img class="catagory_product_image margin-top-5"src = ${ img } />

             <div class="catagory_product_text_box margin-top-5">

               <p class="catagory_product_text catagory_product_text--price ${cross_class}">$ ${ price }</p>
               <p class="catagory_product_text catagory_product_text--price ">$ ${ discount_price} </p>

             </div>

            </div>

        </a>

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


InitToggle();
