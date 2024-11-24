var add_product_buttons = document.getElementsByClassName("add_p");
var edit_delete_button_navbar = document.querySelector(".edit_delete_p--navbar");

const InitEvents = async () => {

  await InitCatagories();

  if(canEdit){
    AddEventToEditButtons();
  }

  AddEventsToAddProducts();

  edit_delete_button_navbar.addEventListener("click",()=>{
    ToggleModal(false);
    ToggleCanEdit();
  });

}

const AddEventToEditButtons = () => {

  var form = document.querySelector(".product_form");

  form.setAttribute("id",'edit-product');
  form.setAttribute("button_id",'edit-product-btn');
  form.setAttribute("redirect",'/admin/');

  var button = document.querySelector(".product_form_button");

  button.setAttribute("id",form.getAttribute("button_id"));

  for(var i =0; i < edit_buttons.length; i++){

    edit_buttons[i].addEventListener("click",async (e)=>{

        var id = e.target.getAttribute('_id');

        var product = await axios.post("/admin/product/one/",{_id:id});

        product = product.data;

        PopulateModal(product,form);
        PopulateContent(product.title,product.catagory,product.price,product.discount,product.thumbnail,product.description);

    });

  }

}


const AddEventsToAddProducts = () => {

  var form = document.querySelector(".product_form");

  form.setAttribute("id",'add-product');
  form.setAttribute("button_id",'add-product-btn');
  form.setAttribute("redirect",'/admin/');
  form.setAttribute("action",'/admin/product/add');

  var button = document.querySelector(".product_form_button");

  button.setAttribute("id",form.getAttribute("button_id"));

  for(var i =0; i < add_product_buttons.length; i++){

    add_product_buttons[i].addEventListener("click",(e)=>{
      ToggleModal(true);
      SetForm(form);
    });

  }

}

const AddEventsToToggleArrows = () => {

  var arrow_catagory_sub = document.getElementsByClassName("arrow_catagory_sub");

    for(var i =0; i < arrow_catagory_sub.length; i++){

      arrow_catagory_sub[i].addEventListener("click",(e)=>{
        ToggleCatagoryProducts(e);
      });

    }

}


InitEvents();
