var add_product = document.querySelector(".add-product");
var isModalOn = false;
var main_interface = document.querySelector(".main_interface");
var modal_wrapper = document.querySelector(".modal_wrapper");
var edit_button = document.getElementsByClassName("edit_button");

function SetForm(action){
    var form = document.querySelector("#product_form");
    form.setAttribute("action",action);
}

function PopulateModal({_id,title,price,description,thumbnail,quantity,discount,banner}){

    var title_ = document.querySelector(".name_input");
    var price_ = document.querySelector(".price_input");
    var description_ = document.querySelector(".description_input");
    var thumbnail_ = document.querySelector(".image_input");
    var quantity_ = document.querySelector(".quantity_input");
    var discount_ = document.querySelector(".discount_input");
    var banner_ = document.querySelector(".banner_input");
    var id_ = document.querySelector(".id_input");


    title_.value = title;
    price_.value = price;
    id_.value = _id;
    description_.value = description;
    thumbnail_.value = thumbnail;
    quantity_.value = quantity;
    discount_.value = discount;
    banner_.value = banner;
    console.log(_id)
    ToggleModal();
    SetForm("/product/edit");

}

function ToggleModal(){
  modal_wrapper.classList.add("active");
  modal_wrapper.classList.remove("inactive");
  main_interface.classList.remove("active");
  main_interface.classList.add("inactive");
}

function AddEventToEditButtons(){

  for(var i =0; i < edit_button.length; i++){

    edit_button[i].addEventListener("click",async (e)=>{

        var id = e.target.getAttribute('_id');
        var product = await axios.get("/edit/"+id);

        product = product.data;
        console.log(product);

        PopulateModal(product);

    });

  }

}


add_product.addEventListener("click",()=>{
  ToggleModal();
  SetForm("/admin/add_product");
});


AddEventToEditButtons();
