var add_review_button = document.querySelector(".add_review_button");
var add_review_container = document.querySelector(".add_review_container");
var review_display_container = document.querySelector(".review_display_container");
var reviews_container = document.querySelector(".reviews_container");

var canLeaveReview = true;

const RenderReviews = (reviews) => {

  var html = "";

  for(var i =0; i < reviews.length; i++) {

      var review_name = reviews[i].name;
      var profile_img = reviews[i].profileImg.length > 0 ? reviews[i].profileImg : "review2.png" ;
      var description = reviews[i].description ;
      var title = reviews[i].title;
      var stars ="";

      for (var x =0; x < Math.floor(product_reviews[i].rating); x++) {
        stars+=`<img src = "/images/star.png" style="float:left;width:30px;height:30px"/>`
      }

      if(reviews[i].rating % 1 != 0) {
        stars += `<img src = "/images/half_star.png" style="float:left;width:30px;height:30px"/>`
      }

      for (var e =0; e < Math.floor(5 - product_reviews[i].rating); e++) {
        stars += `<img src = "/images/no_star.png" style="float:left;width:30px;height:30px"/>`
      }

      html += `
        <div class="product_review_user_container"style="margin-top:20px;padding-top:20px;padding-bottom:20px;border-top:0px none solid">
          <div class="row">
              <div class="col-4">
                  <img class="user_img_review" src = "<%= product_reviews[i].user_info.profileImg %>" style="background:#e6e6e6" />
                  <p class="review_rating user_review_text--name">${reviews[i].user_info.name}</p>
              </div>

              <div class="col-8 "style="margin-top:2.5%"
                  ${ stars }
                  <div class="text-container" style="clear:both;padding-top:10px;">
                  <p class="review_rating review_rating--heading">
                    ${ reviews[i].heading }
                  </p>
                  <p class="user_review_text review_rating--description">
                    ${ reviews[i].description }
                  </p>
                  </div>
              </div>
          </div>
      </div>`

    }

    reviews_container.innerHTML =  html;

}

const InitReviews = () => {

  axios.get("/company/review").then((data)=>{

    var reviews = data.data.reviews;

    RenderReviews(reviews);

  })

}

const DisplayForm = (e)=>{

  review_display_container.innerHTML = ReturnReviewForm();

  e.target.style.visibility = "hidden";

  var exit_review = document.querySelector(".exit_review");
  var review_form = document.querySelector(".review_form");

  exit_review.addEventListener("click",(e)=>{
    ExitForm();
  });

  review_form.addEventListener("submit",async(e)=>{
    e.preventDefault();
    SubmitForm();
  });

}

const SubmitForm = async ()=>{

    var title_input = document.querySelector(".review_input");
    var description_input = document.querySelector(".review_description");

    var title = title_input.value;
    var description = description_input.value;

    if(description.length < 10 || title.length < 4){
      alert("Invalid Input");
      return;
    }
    else{
      SubmitReview(title,description);
    }

}

const SubmitReview = async (title,description) => {

  var profile_data = await axios.get("/user/profile/data");

  var profile_img = profile_data.data.profileImg;
  var name = profile_data.data.name;

  axios.post("/company/review",{name:name,profileImg:profile_img,title:title,description:description}).then((review_response)=>{

    if(review_response.data.reviews){
      alert("Thank you for your feedback!");
      RenderReviews(review_response.data.reviews);
    }
    else if(!res.data){
      window.location.assign("/login");
    }

  }).catch((err)=>{
    alert(err);
  });

}

const ExitForm = () => {
  review_display_container.innerHTML = "";
  add_review_button.style.visibility = "visible";
  canLeaveReview = true;
}

const ReturnReviewForm = ()=>{

  return `
    <div class="relative review_display_container--inner">
    <span class = "exit_review">X</span>

      <p class="review_display_title">Tell us how we are doing!</p>
      <form action = "/company/review" method = "POST" class="review_form">
        <input name = "title" class="form-control review_input" placeholder ="Enter Title">
        <textarea cols=50 rows= 10 name = "name" class="form-control review_description" value = "" placeholder="Enter Review"></textarea>

        <button class="review_submit_button">Submit</button>
      </form>
      </div>
      `

}

if(add_review_button){

  add_review_button.addEventListener("click",(e)=>{

    if(canLeaveReview){
      DisplayForm(e);
      canLeaveReview = false;
    }

  });

}

InitReviews();
