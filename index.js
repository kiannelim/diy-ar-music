// declare global variables up here

function setup() {
  // code written in here will be executed once when the page loads
  setupAppCanvas();
}


function update() {
  // code written in here will be executed every frame
  console.log(getMarkerPair(0, 3).angleBetween);
}

// setupAppCanvas() function will initialize #app-canvas.
// if you intend to use #app-canvas, call this function in setup()
var canvas;
var ctx;
var dpr;
var appWidth;
var appHeight;

function setupAppCanvas() {
  canvas = document.querySelector("#app-canvas");
  dpr = window.devicePixelRatio || 1;

  appWidth = window.innerWidth * dpr;
  appHeight = window.innerHeight * dpr;
  console.log("appWidth =", appWidth, " appHeight =", appHeight);

  canvas.width = appWidth;
  canvas.height = appHeight;
  
  ctx = canvas.getContext("2d");
}
