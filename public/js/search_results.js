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


var overlay_content = document.querySelector(".overlay_content");
var main_content = document.querySelector(".main_content");

var exit = document.querySelector(".exit_search");
var hasSearched = false;
var search_overlay = document.querySelector(".search_page_overlay");
var fixed_time = 1000;
var hasChanged = false;
var search_bar = document.querySelector(".search_all");

exit.addEventListener("click",(e)=>{
  hasSearched = false;
  search_overlay.classList.add("search_inactive");
  search_overlay.classList.remove("search_active");
  overlay_content.classList.remove("active");
  overlay_content.classList.add("inactive");
  main_content.classList.add("active");
  main_content.classList.remove("inactive");
})

search_bar.addEventListener("keyup",(e)=>{

  if(e.keyCode == 13 && !hasSearched){

  var input = search_bar.value;3

      const options = {
        method: "POST",
        body:{
          input:input
        },
        headers: {'Content-Type': 'application/json'}
      };


      axios.post("/search/product/",{input:input}).then((results)=>{

        var data = results.data;

        search_overlay.classList.remove("search_inactive");
        search_overlay.classList.add("search_active");
        overlay_content.classList.remove("inactive");
        overlay_content.classList.add("active");
        main_content.classList.add("inactive");
        main_content.classList.remove("active");
        hasSearched = true;
        var row = document.querySelector(".search_overlay_row");
        var html = ``;
        console.log(results);
        for(var i = 0; i <data.length; i ++){
          html+= RenderItem(data[i]);
        }

        row.innerHTML = html;

      });

  }
})
