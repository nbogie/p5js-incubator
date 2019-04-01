"use strict";

var mic;
var amp;
var scale = 1.0;
var volumeHistory = [];
let rider = 0;

function setup() {
  createCanvas(440, 440);
  background(0);
  volumeHistory = [];
  // Create an audio input and start it
  mic = new p5.AudioIn();
  mic.start();
  // Create a new amplitude analyzer and patch into input
  amp = new p5.Amplitude();
  amp.setInput(mic);

  rectMode(CENTER);
  createCanvas(windowWidth, windowHeight);
  background(100);
  colorMode(HSB, 100);
}

function snapPos(p) {
  return {
    x: snap(p.x),
    y: snap(p.y)
  }
}


function snap(v) {
  return round(v / 100) * 100;
}

function rndColor() {
  return random(['dodgerblue', 'yellow', 'orange', 'white']);
}

function rndRainbowColor(opts) {
  let {
    sat,
    minHue,
    maxHue
  } = opts;
  if (!minHue) {
    minHue = 0;
  }
  if (!maxHue) {
    maxHue = 100;
  }

  colorMode(HSB, 100);
  return color(random(minHue, maxHue), sat, 100);
}

function randomPos() {
  return {
    x: random(width),
    y: random(height)
  }
}

function repeat(n, fn) {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}

function draw() {
  background(0);
  // The getLevel() method returns values between 0 and 1,
  // so map() is used to convert the values to larger numbers
  let level = amp.getLevel()
  volumeHistory.push(level);
  text(round(level * 100) + "", 50, 50)
  scale = map(level, 0, 1.0, 10, width);
  drawHistory(volumeHistory);
}

function volumeToScreen(v) {
  return map(log(v+1), 0, 1, 0, height);
}

function drawHistory(hist) {
  strokeWeight(2);
  stroke('white');
  let x = 0;
  let prevVal = 0;
  hist.forEach((val, ix) => {
    let prevX = ix * 3;
    let x = (ix + 1) * 3;

    line(prevX, height/2 + volumeToScreen(prevVal), x, height/2 + volumeToScreen(val));
    line(prevX, height/2 - volumeToScreen(prevVal), x, height/2 - volumeToScreen(val));
    prevVal = val;
  });
  volumeHistory = volumeHistory.slice(-300);
}