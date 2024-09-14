var add_product_buttons = document.getElementsByClassName("add_p");
var edit_delete_button_navbar = document.querySelector(".edit_delete_p--navbar");

const InitEvents = async () => {

  await InitCatagories();

  if(canEdit){
    AddEventToEditButtons();
  }

  if(canDelete){
    AddDeleteEventToButtons();
  }

  AddEventsToAddProducts();

  edit_delete_button_navbar.addEventListener("click",()=>{
    ToggleModal(false);
    ToggleCanEdit();
  });

}

const AddEventToEditButtons = () => {

  for(var i =0; i < edit_buttons.length; i++){

    edit_buttons[i].addEventListener("click",async (e)=>{

        var id = e.target.getAttribute('_id');

        var product = await axios.post("/admin/product/one/",{_id:id});

        product = product.data;

        PopulateModal(product,"/admin/product/edit");
        PopulateContent(product.title,product.catagory,product.price,product.discount,product.thumbnail,product.description);

    });

  }

}

const AddDeleteEventToButtons = () =>{

  var delete_product_buttons = document.getElementsByClassName("delete_button_p");

  for(var i =0; i < delete_product_buttons.length; i++){
      delete_product_buttons[i].addEventListener("click",async (e)=>{
        await DeleteProduct(e);
      });

    }

}

const AddEventsToAddProducts = () => {

  for(var i =0; i < add_product_buttons.length; i++){

    add_product_buttons[i].addEventListener("click",(e)=>{
      ToggleModal(true);
      SetForm("/admin/product/add");
    });

  }

}

const AddEditAndDeleteFeature  = (canEdit) => {

  for(var i =0; i < edit_delete_containers.length; i++){

    if(canEdit){
      edit_delete_containers[i].classList.remove("edit_delete_container--inactive");
      edit_delete_containers[i].classList.add("edit_delete_container--active");
    }
    else{
      edit_delete_containers[i].classList.add("edit_delete_container--inactive");
      edit_delete_containers[i].classList.remove("edit_delete_container--active");
    }

  }

  if(canEdit){
    AddEventToEditButtons();
  }

}


InitEvents();
