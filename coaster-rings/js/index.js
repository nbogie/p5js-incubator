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
  return random(['dodgerblue']);
  //return random(['dodgerblue', 'yellow', 'orange', 'white']);
}
function repeat(n, fn){
  for (let i=0; i < n; i++){
    fn(n);
  }
}
function drawAgent(agent) {
  push();
  translate(agent.pos.x, agent.pos.y);
  //circle(0, 0, agent.size / 6);

  //translate(0, 100);
  
  repeat(36, ix => {
    rotate(PI/18);
    fill(agent.color);
    noStroke();
    circle(0, 100, agent.size / 6);
  })
  
  pop();
}
function draw() {
  background(0);
  agents.forEach(drawAgent);
}