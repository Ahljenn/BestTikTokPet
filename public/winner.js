// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});



// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

showWinningVideo()

function showWinningVideo() {
  sendGetRequest("/getWinner")
  .then((result) => {
    addVideo(result.url, divElmt);
    let video = document.getElementById("tiktokDiv");
    let textField = document.createElement("h2");
    textField.id = "caption";
    textField.textContent = result.nickname;
    video.append(textField);
    loadTheVideos();
  })
  .catch((err) => {
    console.log(err);
  })
}