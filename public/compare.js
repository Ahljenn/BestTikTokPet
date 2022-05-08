"use strict";


let videoElmts = document.getElementsByClassName("tiktokDiv");
let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");



for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
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

heartButtons.forEach(heart => {
  heart.addEventListener("click", () => {
    heart.className = "heart";
  });
});





    