function CheckPopup(feedback_,redirects_counter){

  var data = null

  if(redirects_counter >= 1 ){
     data = null;
  }
  else{
    data = feedback_.popup_message;
  }

  redirects_counter +=1;

  return {message:data,redirects_counter:redirects_counter};

}

module.exports.CheckPopup = CheckPopup;
