"use strict";
let agents;

var mic;
var amp;
let gNumAgents = 30;

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
  
}

function createAgent(p= randomPos()) {
  return {
    pos: p,
    size: 1,
    growSpeed: 1.5,
    color: color(255,0,0),
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
  let alpha = map(Math.max(100 - agent.age), 0, 200, 0, 100);
  stroke(color(255, 255, 255, alpha))
  noFill();
  
  circle(p.x, p.y, agent.size);
  pop()
}
function updateAgent(agent){
  agent.size += agent.growSpeed;
  agent.age += 1;
}
class Buffer {
  constructor(size){
    this.buffer = [];
    this.size = size;
  }
  //add a new value to the buffer, removing the oldest element
  add(val){
    this.buffer.push(val);
    this.buffer = this.buffer.slice(-this.size);
  }

  get(ix){
    return this.buffer[ix];
  }
  
  //return value at some position in the buffer, from 0 to 1.  
  // frac: a position float from 0.0 to 1.0
  getAtFraction(frac){
    let ix = floor(this.buffer.length * frac);
    return this.get(ix);
  }
  
  //return an average of all of the values in the buffer  
  average(){
    return this.buffer.reduce((accum, current) => accum + current) / this.size;
  }
}
function createRipple(agents){
  agents.push(createAgent({ x: mouseX, y: mouseY }));
}

function draw() {
  background(0);

  // The amp.getLevel() method returns values between 0 and 1,
  smoothingBuffer.add(amp.getLevel())
  let avg = smoothingBuffer.average();

  volHistory.add(avg);
  textSize(32);
  if (avg > 0.3){
    createRipple(agents);
  } 
  agents.forEach(updateAgent);
  agents.forEach(drawAgent);
}
