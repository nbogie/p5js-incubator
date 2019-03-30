"use strict";
let agents;

function setup() {
  rectMode(CENTER);
  createCanvas(windowWidth, windowHeight);
  background(100);
  colorMode(HSB, 100);
  agents = [];
  genAgents();
  noLoop();
}

function rndColor() {
  return random(['blue', 'yellow', 'white', 'pink'])
}
function snapPos(p){
  return {x: snap(p.x), y: snap(p.y)}
}
function createAgent() {
  return {
    pos: snapPos(randomPos()),
    size: random([50, 100]),
    color: rndColor(),
    phase: random(10)
  }
}
function snap(v){
  return round(v/100)*100;
}

function genAgents() {
  repeat(10, i => agents.push(createAgent()));
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

function drawAgent(agent) {
  let p = agent.pos;
  fill(agent.color);
  push();
  noStroke();
  square(p.x, p.y, 100);
  pop()
}

function draw() {
  background(0);
  agents.forEach(drawAgent);
}