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
function randomPos(){
  return {x: random(width), y: random(height)}

}
function rndColor(){
  return random(['blue', 'yellow', 'white'])
}
function createAgent(){
  return {pos: randomPos(), 
    size: random(10, 40),
  color: rndColor()}
}
function genAgents(){
  for(let i = 0 ; i < 10; i++){
    agents.push(createAgent());
  }
}
function rndColor() {
  return random(['dodgerblue', 'yellow', 'orange', 'white']);
}
function drawAgent(agent) {
  push();
  translate(agent.pos.x, agent.pos.y, 100);
  fill(agent.color);
  noStroke();
  circle(0, 0, agent.size);
  let lc = {x: width / 2, y: height/2};
  let d = {x: lc.x - mouseX, y:lc.y- mouseY};

  let p = {
    x: map(sin(frameCount / 300), -1, 1, -100, 100),
    y: map(cos(frameCount / 300), -1, 1, -20, 20),
  }
  stroke(color(255, 255, 255, 40));
  strokeWeight(agent.size*2)

  line(0, 0, d.x, d.y)
  pop();
}
function draw() {
  background(0);
  agents.forEach(drawAgent);
}