var add_review_button = document.querySelector(".add_review_button");
var review_container = document.querySelector(".add_review_container");
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

      html += `
      <div class="story">

        <figure  class="story_shape">
            <img class="story_img" src="/images/${ profile_img }" />

            <figcaption class="story_caption">
            </figcaption>

        </figure>

        <div class="story_text"style="transform:skewX(12deg)">
            <h3 class="heading-tertiary u-margin-bottom-small">${ title } </h3>
            <p>
            ${ description }
            </p>
        </div>

      </div>`

    }

    reviews_container.innerHTML =  html;

}

function Init(){

  axios.get("/company/review").then((data)=>{

    var reviews = data.data.reviews;

    RenderReviews(reviews);

  })

}

if(add_review_button){

  add_review_button.addEventListener("click",(e)=>{

    if(canLeaveReview){
      DisplayForm(e);
      canLeaveReview = false;
    }

  });

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

    var review_title = document.querySelector(".review_input");
    var review_description = document.querySelector(".review_description");
    var title = review_title.value;
    var description = review_description.value;

    if(description.length < 10 || title.length < 4){
      alert("Invalid Input");
      return;
    }
    else{

      var profile = await axios.get("/user/profile/data");
      var profileImg = profile.data.profileImg;
      var name = profile.data.name;

      axios.post("/company/review",{name:name,profileImg:profileImg,title:title,description:description}).then((res)=>{

        if(res.data.reviews){
          alert("Thank you for your feedback!");
          RenderReviews(res.data.reviews);
        }
        else if(!res.data){
          window.location.assign("/login");
        }

      }).catch((err)=>{
        alert(err);
      });

    }

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

Init();
