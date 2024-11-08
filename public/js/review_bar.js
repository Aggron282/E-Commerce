var bars = document.querySelectorAll(".bar");
var bar_progress = document.querySelector(".bar_progress");
var score = 1;
var review_btn = document.querySelector("#productreview");
var review_btn_company =document.querySelector(".review_btn--company");

var form = null;
var companyformreview = null;
var path = "/product/review/"



if(document.querySelector("#formreview")){
  form = document.querySelector("#formreview");
  path = "/product/review/"
  review_btn = document.querySelector("#productreview");
}

if(document.querySelector("#companyformreview")){
  form = document.querySelector("#companyformreview");
  path = "/company/review/";
  review_btn = document.querySelector("#companyreview");
}


var style_config = {
  very_bad:{background:"crimson",solid:"crimson",width:11},
  bad:{background:"linear-gradient(to right,crimson,red)",solid:"crimson",width:22},
  not_good:{background:"linear-gradient(to right,red,orangered)",solid:"orangered",width:33},
  so_so:{background:"linear-gradient(to right,orangered,orange)",solid:"orange",width:44},
  ok:{background:'linear-gradient(to right,orange, rgb(255, 174, 0))',solid:"rgb(255,174,0)",width:55},
  better:{background:'linear-gradient(to right,rgb(255, 174, 0),rgb(204, 255, 0))',solid:"rgb(204,255,0)",width:66},
  good:{background:'linear-gradient(to right,rgb(204, 255, 0),yellowgreen)',solid:"yellowgreen",width:77},
  very_good:{background:'linear-gradient(to right,yellowgreen,rgb(8, 255, 41))',solid:"rgb(8,255,41)",width:88},
  perfect:{background:'linear-gradient(to right,yellowgreen,limegreen)',solid:"limegreen",width:100}
}

var style = style_config.very_bad;

ChangeBarColor(style,1);

function ExtractKey(key,limit){

  var index = key.indexOf(limit);
  var id_ = id.substring(index + limit.length).trim();
  return id_;

}

function GetStyle(value){

  if(value == 1){
    style = style_config.very_bad
  }
  if(value == 1.5){
    style = style_config.bad
  }
  if(value == 2){
    style = style_config.not_good
  }
  if(value == 2.5){
    style = style_config.so_so
  }
  if(value == 3){
    style = style_config.ok
  }
  if(value == 3.5){
    style = style_config.better
  }
  if(value == 4){
    style = style_config.good
  }
  if(value == 4.5){
    style = style_config.very_good
  }
  if(value == 5){
    style = style_config.pefect;
  }

  return style;

}

function InitReviewBar(){


  for(var i =0; i < bars.length; i++){

    bars[i].addEventListener("mouseover",(e)=>{

      var element_value = e.target.getAttribute("value");

      var value = parseFloat(element_value);

      var style = style_config.very_bad;

      ChangeBarColor(style,value);

      style = GetStyle(value);

      for(var i =0; i < bars.length; i++){

        bars[i].style.background = style.solid;

        var c = parseFloat(bars[i].getAttribute("value"));

        if(value < c ){
            bars[i].style.background = "#e6e6e6";
        }

      }

      ChangeBarColor(style,value);

      bar_progress.innerText = value.toString() + "/5";

    });

  }

}

function ChangeBarColor(style,value){
  bar_progress.style.width = style.width.toString()+"%";
  bar_progress.style.background = style.background;
  bar_progress.innerText = value.toString() + "/5";
}


if(form && review_btn){

    form.addEventListener("submit",async (e)=>{
      e.preventDefault();
      SubmitReview();
    });


  review_btn.addEventListener("click",async (e)=>{
    e.preventDefault();
    SubmitReview();
  });

}

async function SubmitReview(){

  var formData = new FormData(form);

  var data = {};

  for (const [key, value] of formData) {
    data[key] = value;
  }

  data.rating = score;

  await axios.post(path,data);

}


InitReviewBar();
