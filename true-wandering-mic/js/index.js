"use strict";
let agents;

var mic;
var amp;
let gNumAgents = 50;

//for smoothing
let smoothingBuffer;

let volHistory;

function setup() {
  // Create an audio input and start it
  mic = new p5.AudioIn();
  mic.start();
  // Create a new amplitude analyzer and patch into input
  amp = new p5.Amplitude();
  amp.setInput(mic);
  smoothingBuffer = new Buffer(4);
  volHistory = new Buffer(100);

  createCanvas(windowWidth, windowHeight);

  colorMode(HSB, 100);
  agents = [];
  regenerateAgents(gNumAgents);

  setInterval(x => regenerateAgents(gNumAgents), 5000);
}

function snapPos(p) {
  return {
    x: snap(p.x),
    y: snap(p.y)
  };
}

function createAgent(frac, colr) {
  colorMode(HSB, 100);

  let p = randomPos();
  p.y = random(0.1, 0.9) * height;
  p.x = width * map(1 - frac, 0, 1, 0.1, 0.9);

  return {
    pos: p,
    size: random(),
    color: colr,
    historyPos: frac,
    phase: random(10)
  };
}

function snap(v) {
  return round(v / 100) * 100;
}

function regenerateAgents(n) {
  agents = [];
  let cs = [];
  repeat(10, i => cs.push(rndRainbowColor({ sat: 40 })));

  repeat(n, i => agents.push(createAgent(i / n, random(cs))));
}

function rndRainbowColor(opts) {
  let { sat, minHue, maxHue } = opts;
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
  };
}

function repeat(n, fn) {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}

function wander(agent) {
  let amt = 10 * volHistory.get(0); //
  agent.pos.x += -5 + 10 * noise(frameCount * agent.phase * 0.01);
  agent.pos.y += -5 + 10 * noise((100 + frameCount) * agent.phase * 0.01);
}

function drawAgent(agent) {
  let p = agent.pos;
  fill(agent.color);
  push();
  noStroke();
  let v = agent.size * 400 * volHistory.getAtFraction(agent.historyPos);
  circle(p.x, p.y, v);
  pop();
}
function drawAgentOutline(agent) {
  let p = agent.pos;
  fill("white");
  push();
  noStroke();
  let v = agent.size * 500 * volHistory.getAtFraction(agent.historyPos);
  circle(p.x, p.y, v);
  pop();
}

class Buffer {
  constructor(size) {
    this.buffer = [];
    this.size = size;
  }
  //add a new value to the buffer, removing the oldest element
  add(val) {
    this.buffer.push(val);
    this.buffer = this.buffer.slice(-this.size);
  }

  get(ix) {
    return this.buffer[ix];
  }

  //return value at some position in the buffer, from 0 to 1.
  // frac: a position float from 0.0 to 1.0
  getAtFraction(frac) {
    let ix = floor(this.buffer.length * frac);
    return this.get(ix);
  }

  //return an average of all of the values in the buffer
  average() {
    return this.buffer.reduce((accum, current) => accum + current) / this.size;
  }
}

function draw() {
  background(0);

  // The amp.getLevel() method returns values between 0 and 1,
  smoothingBuffer.add(amp.getLevel());
  let avg = smoothingBuffer.average();

  volHistory.add(avg);

  agents.forEach(wander);
  agents.forEach(drawAgentOutline);
  agents.forEach(drawAgent);
}
