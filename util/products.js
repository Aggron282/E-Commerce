
async function FindHighestDiscount(products){

  var top_deal = 0;
  var highest_product;

  for(var i =0; i <products.length;i++){

    if(products[i].discount > top_deal){

        top_deal = products[i].discount;
        highest_product = products[i];

      }

    }

  return highest_product;

}
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

function OrganizeCatagories(default_catagories,products){

  var new_catagories = [...default_catagories];

  for(var i =0; i < new_catagories.length; i++){
    const result = products.filter((product) => product.catagory ==  new_catagories[i].catagory);
    new_catagories[i].items = result
  }

  return new_catagories;

}

function OrganizeDiscounts(products){

  var new_products = {...products};

  for(var i =0; i <products.length;i++){

    if(products[i].discount > 20){
      new_products.push(products[i]);
    }

  }

  return  new_products;

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


module.exports.catagoryMatch = catagoryMatch;
module.exports.OrganizeDiscounts = OrganizeDiscounts;
module.exports.GetItemsInCatagory = GetItemsInCatagory;
module.exports.FindHighestDiscount = FindHighestDiscount;
module.exports.OrganizeCatagories = OrganizeCatagories;
