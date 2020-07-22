function setup() {
  
  // code written here will be executed once when the page loads
  
}

function update() {
  
  // code written here will be executed every frame
  
}



var canvas;
var ctx;
var appWidth;
var appHeight;

function setupAppCanvas() {
  
  this.canvas = document.querySelector(canvasId);
  this.ctx = this.canvas.getContext('2d');
  
}