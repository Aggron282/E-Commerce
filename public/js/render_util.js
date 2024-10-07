const RenderProductBox = (catagory,catagory_counter)=>{

  var name = "Name Will Be Placed Here";
  var img = "./images/catagory_3.png";
  var price = "[N/A]";
  var description = "";
  var discount_price=''
  var cross_class = "";
  var product = catagory.products[catagory_counter];

  name = product.title.substring(0, 30) + "...";
  img = "/images/"+product.thumbnail
  price = product.price
  description = product.description.substring(0, 100) + "...";
  discount_price = parseFloat(price - (price * (product.discount / 100)))
  cross_class = product.discount > 0 ? "cross-out" : ""
  discount_price = Math.round(discount_price * 100) / 100;
  discount_price = usd_format.format(discount_price);
  price = usd_format.format(price);

  return (`<a href = ${"/product/"+product._id} >

     <div class= "catagory_product_box product_box--catagory width-100" catagory = ${catagory.catagory} it = ${catagory_counter} >

      <p class="catagory_product_text--name">${ name }</p>

      <img class="catagory_product_image margin-top-5"src = ${ img } />

       <div class="catagory_product_text_box margin-top-5">

         <p class="catagory_product_text catagory_product_text--price ${cross_class}"> ${ price }</p>
         <p class="catagory_product_text catagory_product_text--price "> ${ discount_price} </p>

       </div>

      </div>

  </a>`);

}

function RenderCatagory(items_in_catagory,catagory_name){

  var render_html =  `
  <div class="catagory_container">
   <p class="catagory_name"> ${catagory_name} </p>
    <div>
      ${items_in_catagory}
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

}
