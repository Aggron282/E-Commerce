var canDelete = true;

const DeleteProduct = async (e) => {

  var prompt_requirement = 'DELETE';

  var product_prompt = prompt(`Type ${prompt_requirement} to delete product (There is no way to add product back once deleted)`);

  if(product_prompt == prompt_requirement && canDelete){

    canDelete = false;

    var id = e.target.getAttribute('_id');

    var response =  await axios.post("/admin/product/delete",{_id:id});

      if(response.data){
        CreatePopup("Deleted Product")
        InitCatagories();
      }else{
        CreatePopup("Could not Delete")
      }

  }
  else{
    CreatePopup("Canceled")
  }

  canDelete = true;

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

const AddDeleteEventToButtons = () =>{

  var delete_product_buttons = document.getElementsByClassName("delete_button_p");

  for(var i =0; i < delete_product_buttons.length; i++){
      delete_product_buttons[i].addEventListener("click",async (e)=>{
        await DeleteProduct(e);
      });

    }

}

if(canDelete){
  AddDeleteEventToButtons();
}
