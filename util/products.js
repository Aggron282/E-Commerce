const Product = require("./../models/products.js");
const text_util = require("./text.js");

async function GetItemsInCatagory(default_catagories,catagory){

  Product.find({catagory:catagory}).then((products)=>{

    for(var i =0; i < default_catagories.length; i ++){

      if(catagory == default_catagories[i].catagory){
        default_catagories[i].items = products;
        break;
      }

    }

    return default_catagories;

  });

}

function FindSimilarProducts(input,all_products) {

    input = input.toLowerCase();

    if(!all_products){
      return null;
     }

     var similar_products = [];

     for(var i = 0; i < all_products.length; i ++){

      if(all_products[i].title.toLowerCase().includes(input) ){
         similar_products.push(all_products[i]);
       }

     }

     return similar_products;

}

function FindProductsFromCatagory(catagory_name,organized_products){


  var catagory_name = catagory_name.toLowerCase();
  var products = [];
  var letters_needed = 3;
  var letters_matched = 0;
  var isProductFound = false;

  for(var i =0; i < organized_products.length; i++){

    var current_catagory_name = organized_products[i].catagory.toLowerCase();
    var length_of_name = catagory_name.length > current_catagory_name.length ? catagory_name.length : current_catagory_name.length;

    for(var k =0; k < length_of_name; k++ ){

      if(current_catagory_name == catagory_name ){
        letters_matched++;
      }else{
        letters_matched = 0;
      }

      if(letters_matched >= letters_needed){
        isProductFound = true;
        products = organized_products[i].products;
        break;
      }

      if(!current_catagory_name || !catagory_name){
        break;
      }

    }

    if(isProductFound){
      break;
    }

  }

  return products;

}

function OrganizeCatagories(products){

  var organized_products = [];
  var catagories = [];
  var counter = 0;

  for(var i = 0; i < products.length; i++){

      if(catagories.length <= 0){
        catagories.push(products[i].catagory);
      }

      var isProductFound = false

      for(var l = 0; l < catagories.length; l++){

        if(catagories[l] == products[i].catagory){
          isProductFound = true;
        }

      }

      if(!isProductFound){
        catagories.push(products[i].catagory);
      }

  }

    for(var i = 0; i < products.length; i++){

      var isProductFound = false;

      var config = {
        counter:0,
        catagory:products[i].catagory,
        products:[products[i]]
      }

      if(organized_products.length <=0){
        organized_products.push(config);
        isProductFound = true;
      }

      for(var k =0; k < organized_products.length; k++){

          if(products[i].catagory == organized_products[k].catagory){
            isProductFound = true;
            organized_products[k].products.push(products[i]);
          }

      }

      if(!isProductFound){
        organized_products.push(config);
      }

    }

   return organized_products;

}

function OrganizeDiscounts(all_products){

  const limit_top_discount = 5;

  var highest_discount_product = {...all_products[0]};
  var products = [...all_products];
  var top_discount_products = [];
  var product_ids = [];

  var highest_discount = 0;

  var isProductFound = false;

  for(var k = 0; k < limit_top_discount; k++){

    for(var i =0; i < products.length; i++){

      isProductFound = false;

      if(products[i]){

          var current_product = products[i]._doc;

          for(var z = 0; z < product_ids.length; z++){

            isProductFound = false;

            if(JSON.stringify(current_product._id) == product_ids[z]){
                isProductFound = true;
              }

            }

            if(current_product.discount >= highest_discount && !isProductFound){
              highest_discount = current_product.discount;
              highest_discount_product = current_product;
              counter = i;
              product_ids.push(JSON.stringify(current_product._id));

            }

          }

      }

      if(!isProductFound && highest_discount_product){
        top_discount_products.push(highest_discount_product);
        highest_discount_product = null;
        highest_discount = 0;
        products[counter] = null;
      }

    }

    return  top_discount_products;

}

function catagoryMatch(catagories, catagory_needed,counter) {

  var all_catagories = [...catagories];
  var current;

  for(i = 0; i < all_catagories.length; i ++){

    var current_catagory =  all_catagories[i];

    if(current_catagory.catagory == catagory_needed){

      current_catagory.counter +=  4;

      if(current_catagory.counter < 0){
        current_catagory.counter = 0;
      }

      if(current_catagory.counter > Math.floor(current_catagory.products.length  / 4) ){
        current_catagory.counter = 0;
      }

      return {all:all_catagories,current:current_catagory};

      break;

    }

  }

}


module.exports.FindProductsFromCatagory = FindProductsFromCatagory;
module.exports.FindSimilarProducts = FindSimilarProducts;
module.exports.OrganizeCatagories = OrganizeCatagories;
module.exports.catagoryMatch = catagoryMatch;
module.exports.OrganizeDiscounts = OrganizeDiscounts;
module.exports.GetItemsInCatagory = GetItemsInCatagory;
module.exports.OrganizeCatagories = OrganizeCatagories;
