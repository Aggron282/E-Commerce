var title_el = document.querySelector(".product_item_text--title");
var result_page_numbers = document.getElementsByClassName("result_page_number");

var new_title = titleCase(title_el.innerHTML);
var href = window.location.href;

title_el.innerHTML = new_title;

for(var i =0; i < result_page_numbers.length; i++){

    result_page_numbers[i].addEventListener("click",(e)=>{

      var page_number = e.target.getAttribute("page");
      var new_href = href.substring(0,href.length - 1,-1);

      new_href += page_number;

      window.location.assign(new_href);

  });

}
