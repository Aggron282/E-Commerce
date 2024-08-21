//
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

function OrganizeCatagories(products){

  var organized_products = [];
  var catagories = [];
  var counter=0;

  for(var i = 0; i < products.length; i++){

      if(catagories.length <= 0){
        catagories.push(products[i].catagory);
      }

      var isFound = false

      for(var l = 0; l < catagories.length; l++){

        if(catagories[l] == products[i].catagory){
          isFound = true;
        }

      }

      if(!isFound){
          catagories.push(products[i].catagory);
      }

  }

    for(var i = 0; i < products.length; i++){

      var isFound = false;

      var config = {
        counter:0,
        catagory:products[i].catagory,
        products:[products[i]]
      }

      if(organized_products.length <=0){
        organized_products.push(config);
        isFound = true;
      }

      for(var k =0; k < organized_products.length; k++){

          if(products[i].catagory == organized_products[k].catagory){
            isFound = true;
            organized_products[k].products.push(products[i]);
          }

      }

      if(!isFound){
        organized_products.push(config);
      }

    }

   return organized_products;

}

function OrganizeDiscounts(all_products){

  var highest_discount_product = {...all_products[0]};
  var products = [...all_products];
  var limit_top_discount = 5;
  var top_discount_products = [];
  var _ids = [JSON.stringify(highest_discount_product._doc._id)];
  var highest_discount = 0;
  var isFound = false;

  for(var k = 0; k < limit_top_discount; k++){


    for(var i =0; i < products.length; i++){

      if(products[i]){


        isFound = false;

          var product_doc = products[i]._doc;
          for(var z = 0; z < _ids.length; z++){

            isFound = false;
            if(JSON.stringify(product_doc._id) == _ids[z]){
                isFound = true;
              }

            }

          }else{
            isFound = true;
          }


            if(product_doc.discount >= highest_discount && !isFound){
              highest_discount = product_doc.discount;
              highest_discount_product = product_doc;
              counter = i;
              _ids.push(JSON.stringify(product_doc._id));
            }

          }


      if(!isFound && highest_discount_product){
        top_discount_products.push(highest_discount_product);
        highest_discount_product = null;
        highest_discount = 0;
        products[counter] = null;

      }


  }

  console.log(top_discount_products);

  return  top_discount_products;

}

function catagoryMatch(catagories, catagory_needed,counter) {

  var catagories_ = [...catagories];
  var current;

  for(i = 0; i < catagories_.length; i ++){

    if(catagories_[i].catagory == catagory_needed){

      catagories_[i].counter +=  counter * 4;

      if(catagories_[i].counter < 0){
        catagories_[i].counter = 0;
      }

      if(catagories_[i].counter >= Math.floor(catagories_[i].items.length / 3) ){
        catagories_[i].counter = 0;
      }

      current = catagories_[i];

      return {all:catagories_,current:current};

    }

  }

}

module.exports.OrganizeCatagories = OrganizeCatagories;
module.exports.catagoryMatch = catagoryMatch;
module.exports.OrganizeDiscounts = OrganizeDiscounts;
module.exports.GetItemsInCatagory = GetItemsInCatagory;
module.exports.OrganizeCatagories = OrganizeCatagories;
