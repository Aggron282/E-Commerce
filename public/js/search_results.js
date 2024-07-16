var overlay_content_element = document.querySelector(".overlay_content");
var main_content_element = document.querySelector(".main_content");
var exit_element = document.querySelector(".exit_search");
var search_overlay_element = document.querySelector(".search_page_overlay");
var search_bar_element = document.querySelector(".search_all");
var search_overlay_row_element = document.querySelector(".search_overlay_row");

var hasSearched = false;
var hasChanged = false;

var fixed_time = 1000;


function RenderItem(result){

  var name = result.title.substring(0, 30) + "..."
  var img = "./"+result.thumbnail
  var price = result.price
  var description = result.description.substring(0, 100) + "..."

  var html =`
    <div class="col-3 no-margin-left">

    <div class= "product_box fix_x width-100">

      <p class="catagory_name"> ${ name } </p>

      <img class="product_image" src = ${ img } />

      <div class="product_text_box">
        <p class="product_description_display"> ${ description } </p>
        <p class="catagory_price_new ">$ ${ price } </p>

        <a href = "/product/${ result._id }" ><p class="product_detail fix_y">See Details</p></a>

      </div>

    </div>

  </div>`

  return html;

}

exit_element.addEventListener("click",(e)=>{

  hasSearched = false;

  search_overlay_element.classList.add("search_inactive");
  overlay_content_element.classList.add("inactive");
  main_content_element.classList.add("active");

  search_overlay_element.classList.remove("search_active");
  overlay_content_element.classList.remove("active");
  main_content_element.classList.remove("inactive");

})

search_bar_element.addEventListener("keyup",(e)=>{

  if(e.keyCode == 13 && !hasSearched){

      var input = search_bar_element.value;

      const options = {
        method: "POST",
        body:{
          input:input
        },
        headers: {'Content-Type': 'application/json'}
      };


      axios.post("/search/product/",{input:input}).then((results)=>{

        var html = ``;
        var data = results.data;

        hasSearched = true;

        search_overlay_element.classList.remove("search_inactive");
        main_content_element.classList.remove("active");
        overlay_content_element.classList.remove("inactive");

        search_overlay_element.classList.add("search_active");
        overlay_content_element.classList.add("active");
        main_content_element.classList.add("inactive");


        for(var i = 0; i <data.length; i ++){
          html+= RenderItem(data[i]);
        }

        search_overlay_row_element.innerHTML = html;

      });

  }

})
