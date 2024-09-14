var edit_buttons = document.getElementsByClassName("edit_button_p");
var edit_delete_containers = document.getElementsByClassName("edit_delete_container");

var canEdit = false;
var isModalOn = false;


const ToggleCanEdit = () =>{
  canEdit = !canEdit;
  AddEditAndDeleteFeature(canEdit);
}

const ToggleEdit = (canEdit_) => {
  canEdit = canEdit_;
}
