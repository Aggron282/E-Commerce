var canDelete = true;

const DeleteProduct = async (e) => {

  var prompt_requirement = 'DELETE';

  var product_prompt = prompt(`Type ${prompt_requirement} to delete product (There is no way to add product back once deleted)`);

  if(product_prompt == prompt_requirement && !canDelete){

    canDelete = false;

    var id = e.target.getAttribute('_id');
    var product = await axios.post("/admin/product/delete",{_id:id}).catch((err)=>{console.log(err)});

    if(product){
      Init();
    }

  }
  else{
    alert("Canceled");
  }

  canDelete = true;

}
