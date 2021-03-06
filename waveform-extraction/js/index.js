"use strict";
let agents;
let waveform;

class SineWaveform{
  constructor(freq){
    this.frequency = freq;
  }
  valueNow(phase = 0) {
    return sin(phase + this.frequency * frameCount);
  }
}

function setup() {
  rectMode(CENTER);
  createCanvas(windowWidth, windowHeight);
  background(100);
  colorMode(HSB, 100);
  agents = [];
  genAgents();
  waveform = new SineWaveform(0.01);  
}

function rndColor() {
  return random(['blue', 'yellow', 'white', 'pink'])
}

function createAgent() {
  return {
    pos: randomPos(),
    size: random([50, 100]),
    color: rndColor(),
    phase: random(10)
  }
}

function genAgents() {
  repeat(4, i => agents.push(createAgent()));
}

function rndColor() {
  return random(['dodgerblue', 'yellow', 'orange', 'white']);
}

function randomPos() {
  return { x: random(width), y: random(height) }
}

function repeat(n, fn) {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}

function drawAgentRing(agent, radCoef) {
  fill(agent.color);
  stroke(agent.color)
  strokeWeight(0.5)
  push();
  translate(agent.pos.x, agent.pos.y);
  rotate(waveform.valueNow(agent.phase * radCoef) + PI / 4);
  repeat(36, ix => {
    line(0, agent.size * 0.8 * radCoef, 0, agent.size * radCoef);
    rotate(PI / 18);
  })
  pop();
}

function drawAgent(agent) {
  drawAgentRing(agent, 1);
  drawAgentRing(agent, 0.7);
}

function draw() {
  background(0);
  waveform.frequency = map(mouseX, 0, width, 0.0001, 0.03)
  agents.forEach(drawAgent);
}