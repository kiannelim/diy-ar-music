// code written in here will be executed once when the page loads
function setup() {
  setupAppCanvas();
  
}

// code written in here will be executed every frame
function update() {

}

// setupAppCanvas() function will initialize #app-canvas.
// if you intend to use #app-canvas, call this function in setup()
var canvas;
var ctx;
var appWidth;
var appHeight;

function setupAppCanvas() {
  canvas = document.querySelector("#app-canvas");
  ctx = canvas.getContext("2d");

  appWidth = window.innerWidth;
  appHeight = window.innerHeight;
  console.log("appWidth =", appWidth, " appHeight =", appHeight);

  canvas.width = appWidth;
  canvas.height = appHeight;
}
