// const delete_buttons = document.getElementsByClassName("delete_button");
//
// for(var i = 0; i < delete_buttons.length;i++){
//
//   delete_buttons[i].addEventListener("click",(e)=>{
//     Delete(e);
//   })
//
// }
//
//
// const Delete = (e) => {
//
//   e.preventDefault();
//
//   var btn = e.target;
//   var parentElement = btn.parentNode.parentNode.parentNode.parentNode;
//
//   var id = parentElement.getAttribute("prodId");
//
//   fetch("/admin/delete_product/"+id,{
//     method:"DELETE"
//   }).then((data)=>{
//     console.log(data);
//   }).then((new_data)=>{
//     window.location.reload();
//   });
//
// }
