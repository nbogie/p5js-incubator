"use strict";
let agents;
let myRippler;
var mic;
var amp;
let gNumAgents = 20;

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

  agents = [];
  myRippler = rippler();
}

function createAgent(p = randomPos()) {
  return {
    pos: p,
    size: 1,
    growSpeed: 1.5,
    hue: ((frameCount/10) % 100),
    age: 0,
    phase: random(10)
  }
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
  push();
  strokeWeight(0.5);
  let alpha = map(Math.max(100 - agent.age), 0, 100, 0, 100);
  colorMode(HSB, 100)
  stroke(color(agent.hue, 100, 100, alpha))
  noFill();

  circle(p.x, p.y, agent.size);
  pop()
}

function updateAgent(agent) {
  agent.size += agent.growSpeed;
  agent.age += 1;
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

function jitter(pos, v){
  return {
    x: pos.x + random(-v, v),
    y: pos.y + random(-v, v),
  }
}
function mousePos(){
  return {x: mouseX, y: mouseY};
}

function createRipple(agents) {
  agents.push(createAgent(jitter(mousePos(), 4)));
}

function rippler() {
  let lastRippleTime = millis()

  return {
    stimulate: function(agents){
      let now = millis();
      if (now - lastRippleTime > 100){
        createRipple(agents);
        lastRippleTime = millis();
      }
    }
  }

}
function cullAgents(){
  if (agents.length > gNumAgents){
    agents = agents.slice(-gNumAgents);
  }
}

function draw() {
  background(0);

  // The amp.getLevel() method returns values between 0 and 1,
  smoothingBuffer.add(amp.getLevel())
  let avg = smoothingBuffer.average();

  volHistory.add(avg);
  if (amp.getLevel() > 0.3) {
    myRippler.stimulate(agents);
  }
  agents.forEach(updateAgent);
  agents.forEach(drawAgent);
  cullAgents()
}