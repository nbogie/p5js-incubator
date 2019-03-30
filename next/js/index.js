"use strict";
let agents;

var mic;
var amp;
var scale = 1.0;

function setup() {
  createCanvas(440, 440);
  background(0);
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
  agents = [];
  genAgents();
//  noLoop();
}

function snapPos(p) {
  return {
    x: snap(p.x),
    y: snap(p.y)
  }
}

function createAgent() {
  return {
    pos: snapPos(randomPos()),
    size: random([50, 100]),
    color: rndRainbowColor({
      sat: 70,
      minHue: 0,
      maxHue: 100
    }),
    phase: random(10)
  }
}

function snap(v) {
  return round(v / 100) * 100;
}

function genAgents() {
  repeat(10, i => agents.push(createAgent()));
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

function drawAgent(agent) {
  let p = agent.pos;
  fill(agent.color);
  push();
  noStroke();
  square(p.x, p.y, scale);
  pop()
}

function draw() {
  background(0);
  // The getLevel() method returns values between 0 and 1,
  // so map() is used to convert the values to larger numbers
  scale = map(amp.getLevel(), 0, 1.0, 10, width);
  
  agents.forEach(drawAgent);
}
