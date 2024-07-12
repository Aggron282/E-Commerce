
var toggle_buttons = document.getElementsByClassName("catagory_arrow");
var product_boxes = document.getElementsByClassName("product_box");
var catagories = null;
var counter = 0;
var increase = 4;

for(var i = 0; i < toggle_buttons.length; i ++){
  toggle_buttons[i].addEventListener("click",async (e)=>{
    var counter = e.target.getAttribute("counter");
    var catagory = e.target.getAttribute("catagory");
    ToggleCatagories(counter,catagory);
  });
}


function RenderItems(catagory){

  var name = "Name Will Be Placed Here";
  var img = "./images/catagory_3.png";
  var price = "[N/A]";
  var description = "";
  var populate = document.querySelector("#_"+catagory.catagory);

  populate.innerHTML = "";

  var html = ``;

   for(var i = 0; i <= 3; i++) {

    var i_ = i + catagory.counter;

    if(catagory.items[i_]){
       name = catagory.items[i_].title.substring(0, 30) + "...";
       img = "./"+catagory.items[i_].thumbnail
       price = catagory.items[i_].price
       description = catagory.items[i_].description.substring(0, 100) + "...";
     }

     html += `
     <div class="col-3 no-margin-left">

       <div class= "product_box fix_x width-100" catagory = ${catagory.catagory} it = ${i_} >

        <p class="catagory_name">${ name }</p>

        <img class="product_image"src = ${ img } />

         <div class="product_text_box">
           <p class="product_description_display">${description}</p>
           <p class="catagory_price_new ">$ ${ price }</p>
           <a href = ${"/product/"+catagory.items[i_]._id} >
            <p class="product_detail fix_y">See Details</p>
           </a>
         </div>

         </div>

     </div>`
 }

 populate.innerHTML = html;

}

async function ToggleCatagories(counter,catagory) {

  const options = {
  method: "POST",
  body:JSON.stringify({
    "counter":`${counter}`,
    "catagory":`${catagory}`
  }),
  headers: {'Content-Type': 'application/json'}
};

  axios.post("/catagories",options).then(async(res)=>{

    var current = await res.data.current;

    if(current){
      RenderItems(current);
    }

  });

}
