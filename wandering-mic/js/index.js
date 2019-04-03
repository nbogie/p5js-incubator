"use strict";
let agents;

var mic;
var amp;
let volHistory = []
let gNumAgents = 40;

//for smoothing
let smoothingBuffer = [];
let bufferSize = 4;

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
  genAgents(gNumAgents);
  setInterval(x => genAgents(gNumAgents), 5000);
  volHistory = [];
}

function snapPos(p) {
  return {
    x: snap(p.x),
    y: snap(p.y)
  }
}

function createAgent(frac) {
  let p = randomPos();
  p.y = random(0.1, 0.9)*height;
  p.x = width * map(1-frac, 0, 1, 0.1, 0.9);
  return {
    pos: snapPos(p),
    size: frac,
    color: rndRainbowColor({
      sat: 70,
      minHue: 0,
      maxHue: 100
    }),
    historyPos: frac,
    phase: random(10)
  }
}

function snap(v) {
  return round(v / 100) * 100;
}

function genAgents(n) {
  agents = [];
  repeat(n, i => agents.push(createAgent(i/n)));
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
  let v = agent.size * 400*volHistory[floor(volHistory.length * agent.historyPos)]
  circle(p.x, p.y, v);
  pop()
}
function drawAgentOutline(agent) {
  let p = agent.pos;
  fill('white');
  push();
  noStroke();
  let volHistoryIx = floor(volHistory.length * agent.historyPos);
  let v = agent.size * 500 * volHistory[volHistoryIx]
  circle(p.x, p.y, v);
  pop()
}

function draw() {
  background(0);
  // The getLevel() method returns values between 0 and 1,
  // so map() is used to convert the values to larger numbers
  smoothingBuffer.push(amp.getLevel());
  smoothingBuffer = smoothingBuffer.slice(-bufferSize);
  let avg = smoothingBuffer.reduce((prev, current) => prev + current) / bufferSize;
  volHistory.push(avg);
  volHistory = volHistory.slice(-100);
  agents.forEach(drawAgentOutline);
  agents.forEach(drawAgent);
}
