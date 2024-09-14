function CheckPopup(feedback_,redirects_counter){

  var data = null

  if(redirects_counter >= 1 ){
     data = null;
  }
  else if (feedback_){
    data = feedback_.popup_message ? feedback_.popup_message : null;
  }

  redirects_counter +=1;

  return {message:data,redirects_counter:redirects_counter};

}

module.exports.CheckPopup = CheckPopup;
