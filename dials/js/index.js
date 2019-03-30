"use strict";
let agents;

function setup() {
  rectMode(CENTER);
  createCanvas(windowWidth, windowHeight);
  background(100);
  //  noLoop();
  agents = [];
  genAgents();
}
function randomPos() {
  return { x: random(width), y: random(height) }

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
  return random(['dodgerblue']);
  //return random(['dodgerblue', 'yellow', 'orange', 'white']);
}
function repeat(n, fn) {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}
function drawAgent(agent) {
  push();
  translate(agent.pos.x, agent.pos.y);
  colorMode(HSB, 100);
  rotate(PI / 4)
  fill(agent.color);
  stroke(agent.color)
  let numMarks = map(sin(agent.phase + frameCount / 30), -1, 1, 3, 28)
  repeat(numMarks, ix => {
    line(0, agent.size * 0.8, 0, agent.size);
    rotate(PI / 18);
  })
  pop();
}

function draw() {
  background(0);
  agents.forEach(drawAgent);
}