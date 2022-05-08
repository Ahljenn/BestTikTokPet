"use strict";


let videoElmts = document.getElementsByClassName("tiktokDiv");
let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
let nextButton = document.getElementById("next");

for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click", function() { 
    reloadVideo(videoElmts[i]) 
  });
  heartButtons[i].classList.add("unloved");
  heartButtons[i].id = i;
} 

//Get the videos on load
sendGetRequest("/getTwoVideos")
.then((result) => {
  for (let i=0; i<2; i++) {
    addVideo(result[i],videoElmts[i]);
  }
  
  // load the videos after the names are pasted in! 
  loadTheVideos();
})
.catch((err) => {
  console.log(err);
});

//Add functionality for each heart button
heartButtons.forEach(heart => {
  heart.addEventListener("click", () => {

    //Unlove the other video if it is already loved
    if(heart.id == "0"){
      document.getElementById("1").className = "heart unloved";
    } else {
      document.getElementById("0").className = "heart unloved";
    }

    //Set clicked video to loved
    heart.className = (heart.className == "heart") ? "heart unloved" : "heart";
  });
});

nextButton.addEventListener("click", () => {

  //User should not be able to click next if none of them are of class "heart"

  
  let data = {};
  sendPostRequest("/insertPref", data)
  .then((result) => {
    window.location.reload();
  })
  .catch((err) =>{
    console.log(err);
  });
});





    