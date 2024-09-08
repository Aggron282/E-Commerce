// var delete_perm = document.querySelector(".delete_perm");
// var id_element = document.querySelector("#product_id_hash");
//
// delete_perm.addEventListener("click",(e)=>{
//
//   var prompt_requirement = 'DELETE';
//   var product_prompt = prompt(`Type ${prompt_requirement} to delete product (There is no way to add product back once deleted)`);
//
//   if(product_prompt == prompt_requirement){
//
//       var _id = id_element.getAttribute("_id");
//
//       axios.post("/admin/product/delete",{_id:_id}).then((result)=>{
// console.log(result);
//         if(result){
//             //alert("Deleted Product");
//           //  window.location.reload();
//         }
//
//       }).catch((err)=>{console.log(err)});
//
//   }
//   else{
//     alert("Canceled")
//   }
//
// })
//
// ToggleEdit(true);
