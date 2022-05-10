'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}

/* start of code run on start-up */
// create object to interface with express
const app = express();


/* Other constants */
const MAX_PREF = 2;

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());

//Get two distinct random videos from VideoTable and sendback as an array in the HTTP response
app.get("/getTwoVideos", async (req, res, next) => {

  console.log("Server recieved GET request at /getTwoVideos");
  
  let videos = new Set();
  while (videos.size != 2){
      await getRandomVideo()
      .then((result) => {
        videos.add(result.url+"~"+result.rowIdNum);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
  console.log("Videos:", videos);
  const twoVideos = Array.from(videos);
  res.json(twoVideos); //Return array with ~(rowIdNum) appended on each video
});


//Send post request for user preference after selecting video
app.post("/insertPref", async (req, res, next) => {

  //Debugging:
  let pref = await getAllPrefs();
  console.log(pref);
  //
  
  console.log("Server recieved POST request at /insertPref");
  console.log("User ratings:", req.body);
  checkAndInsert(req.body)
  .then((result) => {
    console.log(result);
    res.send(result);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

app.get("/getWinner", async function(req, res) {
  console.log("Getting winner");
  try {

  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8, false);

  //Since winner is id, get the video corresponding to the rowid
  //send back the html with that id
    
  res.json({});
  } catch(err) {
    res.status(500).send(err);
  } 
});

// Page not found
app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

async function getRandomVideo(){
  const sql = `SELECT * FROM VideoTable url ORDER BY RANDOM();`;
  return await db.get(sql);
}

async function checkAndInsert(ratings){
  let prefTableContents = await getAllPrefs();
  if (prefTableContents.length != MAX_PREF){
    await insertPreference(ratings.better, ratings.worse);
    return "Continue";
  } else {
    return "Pick winner";
  }
}

// gets preferences out of preference table
async function getAllPrefs() {
  const dumpCmd = "SELECT * from PrefTable";
  
  try {
    let prefs = await db.all(dumpCmd);
    return prefs;
  } catch(err) {
    console.log("pref dump error", err);
  }
}

// inserts a preference into the database
async function insertPreference(i,j) {

  // SQL command we'll need
const insertCmd = "INSERT INTO PrefTable (better,worse) values (?, ?)";
  
   try {
    await db.run(insertCmd, [i,j]);
  } catch(error) {
    console.log("pref insert error", error);
  }
}


