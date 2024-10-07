const RenderProductBox = (product,catagory,counter) => {

  var discount_price = product.price - (product.price * (product.discount / 100));

  discount_price = Math.round(discount_price * 100) / 100;
  discount_price = usd_format.format(discount_price);

  if(!catagory || !product){
    return;
  }

  return(`
    <div class= "catagory_product_box product_box--catagory width-100 relative min-z " catagory = "${catagory.catagory.toLowerCase() }" it = "${counter}"  >

    <p class="catagory_product_text--name">${product.title.substring(0,50)}</p>

    <img class="catagory_product_image_admin margin-top-5" src = '${"/images/"+product.thumbnail.replace(/ /g,'')}' />

    <div class="catagory_product_text_box margin-top-5">

      <p class="catagory_product_text catagory_product_text--price ${discount_price < product.price ? "cross-out" : ""}"> ${ usd_format.format(product.price)}</p>
      <p class="catagory_product_text catagory_product_text--discount "> ${ discount_price + " (" + product.discount + "% Discount)"  }</p>
      <p class="catagory_product_text catagory_product_text--quantity "> Qty: ${ product.quantity} </p>

      <a href =${ "/admin/product/"+product._id} >
        <p class="catagory_product_detail">See Details</p>
      </a>

  </div>`
  
 );

}


const RenderFeatureBox = (product) => {

  return (`
    <div class="edit_delete_container edit_delete_container--inactive ">

      <div class="inner_edit edit_button_p"  _id = "${product._id}">
        Edit
      </div>

      <div class="inner_edit delete_button_p" _id = "${product._id}">
        Delete
      </div>

    </div>
  `)

}

const RenderArrows = (catagory) => {

  return (`
    <div class="arrow_catagory_container arrow_catagory_container--admin">

      <div class="arrow_catagory arrow_catagory--left arrow_catagory--left--admin " multiplier = "-1" catagory = "${catagory}">
        <img src = "./images/arrow.png"  multiplier = "-1"  catagory = "${catagory}" />
      </div>

      <div class="arrow_catagory arrow_catagory--right arrow_catagory--right--admin" multiplier ="1" catagory =  "${catagory}" >
        <img src = "./images/arrow.png" multiplier = "1" catagory =  "${catagory}"  />
      </div>

    </div>
  `);

}

const RenderCatagoryTitle = (catagory) => {

  return (`
    <div class="catagory_title_container">
      <p class="title"> ${catagory.catagory}</p>
    </div>
  `);

}
