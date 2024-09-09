//
var delete_button_p = document.getElementsByClassName("delete_button_p");
var canDelete = false;

for(var i =0; i < delete_button_p.length; i++){

  delete_button_p[i].addEventListener("click",async (e)=>{
    await DeleteProduct(e);
  });

}

async function DeleteProduct(e){

  var prompt_requirement = 'DELETE';

  var product_prompt = prompt(`Type ${prompt_requirement} to delete product (There is no way to add product back once deleted)`);

  if(product_prompt == prompt_requirement && !canDelete){

    canDelete = true;

    var id = e.target.getAttribute('_id');
    var product = await axios.post("/admin/product/delete",{_id:id}).catch((err)=>{console.log(err)});

    if(product){
      Init();
    }

  }
  else{
    alert("Canceled");
  }

  canDelete = false;

}
