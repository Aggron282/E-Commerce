var bars = document.querySelectorAll(".bar");
var bar_progress = document.querySelector(".bar_progress");
var score = 1;
var review_btn =document.querySelector(".review_btn");
for(var i =0; i < bars.length; i++){

  bars[i].addEventListener("mouseover",(e)=>{

    var id = e.target.getAttribute("id");
    var value_ = e.target.getAttribute("value");
    var limit = "bar"
    var index = id.indexOf(limit);
    var id_ = id.substring(index + limit.length).trim();
    var value = parseFloat(value_);

    score = value;

    var style ={background:"crimson",width:11}

    bar_progress.style.width = style.width.toString()+"%";
    bar_progress.style.background = style.background;

    if(value == 1){
      style = {background:"crimson",width:11}
    }
    if(value == 1.5){
      style = {background:"linear-gradient(to right,crimson,red)",solid:"crimson",width:22}
    }
    if(value == 2){
      style = {background:"linear-gradient(to right,red,orangered)",solid:"orangered",width:33}
    }
    if(value == 2.5){
      style = {background:"linear-gradient(to right,orangered,orange)",solid:"orange",width:44}
    }
    if(value == 3){
      style = {background:'linear-gradient(to right,orange, rgb(255, 174, 0))',solid:"rgb(255,174,0)",width:55}
    }
    if(value == 3.5){
      style = {background:'linear-gradient(to right,rgb(255, 174, 0),rgb(204, 255, 0))',solid:"rgb(204,255,0)",width:66}
    }
    if(value == 4){
      style = {background:'linear-gradient(to right,rgb(204, 255, 0),yellowgreen)',solid:"yellowgreen",width:77}
    }
    if(value == 4.5){
      style = {background:'linear-gradient(to right,yellowgreen,rgb(8, 255, 41))',solid:"rgb(8,255,41)",width:88}
    }
    if(value == 5){
      style = {background:'linear-gradient(to right,yellowgreen,limegreen)',solid:"limegreen",width:100}
    }

    for(var i =0; i < bars.length; i++){

      bars[i].style.background = style.solid;

      var c = parseFloat(bars[i].getAttribute("value"));

      if(value < c ){
          bars[i].style.background = "#e6e6e6";
      }

    }

    bar_progress.style.width = style.width.toString()+"%";
    bar_progress.style.background = style.background;
    bar_progress.innerText = value.toString() + "/5";

  });

}

var style ={background:"red",width:11}
bar_progress.style.width = style.width.toString()+"%";
bar_progress.style.background = style.background;

var formreview = document.querySelector("#formreview");

formreview.addEventListener("submit",async (e)=>{
  e.preventDefault();
    var formData = new FormData();

    var data = {};

    for (const [key, value] of formData) {
      data[key] = value;
    }

    data.rating = score;
    console.log(data)
  
    await axios.post("/product/review/",data);

});


review_btn.addEventListener("click",async (e)=>{
  e.preventDefault();

    var formData = new FormData(formreview);

    var data = {};

    for (const [key, value] of formData) {
      console.log(key,value)
      data[key] = value;
    }

    data.rating = score;
      console.log(data)

    await axios.post("/product/review/",data);

});
