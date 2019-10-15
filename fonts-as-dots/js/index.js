"use strict";
let font;
let pts;
let ptsCorners;

let gWord = "Barrio";

let gLastInteractionTime = -1;

function preload() {
  font = loadFont("Barrio-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  computeTextPoints(gWord);
}

function computeTextPoints(w) {
  [pts, ptsCorners] = [0, 1].map(thresh =>
    font.textToPoints(gWord, 20, 120, 120, {
      sampleFactor: 0.1,
      simplifyThreshold: thresh
    })
  );
}
function draw() {
  background(200);
  noStroke();
  fill("black");
  push();
  pts.forEach((pt, ix) => {
    let elSize = 2;
    ellipse(pt.x, pt.y, elSize);
  });

  stroke("black");
  strokeWeight(0.5);
  noFill();
  ptsCorners.forEach((pt, ix) => {
    ellipse(pt.x, pt.y, 8);
  });
}

function keyPressed() {
  const now = millis();
  if (moreThanNSecondsAgo(gLastInteractionTime, 1000)) {
    gWord = "";
  }

  gWord = gWord + key;
  gLastInteractionTime = now;

  computeTextPoints();
}

function moreThanNSecondsAgo(v, period) {
  return v + period < millis();
}
