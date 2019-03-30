"use strict";
var capture;

function setup() {
  createCanvas(480, 480);
  capture = createCapture();
  capture.hide();
}

function draw() {
  var aspectRatio = capture.height / capture.width;
  var h = width * aspectRatio;
  h = 120;
  image(capture, 0, h*0, width, h);
  image(capture, 0, h*1, width, h);
  image(capture, 0, h*2, width, h);
  image(capture, 0, h*3, width, h);
  
  filter(INVERT);
}