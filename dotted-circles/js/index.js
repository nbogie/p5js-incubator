"use strict";
let lastDist = 0;
let mousePos;
let ps;
let colorPhase;
let rot = 0;
let rotSpeed = 0.9;
let orbitMod = 1 / 300;
let alphaPhase;
let c;

function setup() {
  rectMode(CENTER);
  ps = [];
  createCanvas(windowWidth, windowHeight);
  background(random([0, 100, 255]));
  colorPhase = random(0, 360);
  colorMode(HSB);
  rotSpeed = random(0.05, random(0.1, 1.5));
  orbitMod = random(1 / 500, 1 / 100);
  alphaPhase = random(300);
  c = {x: width/2, y: height/2};
  setInterval(auto, 3000);
}
function auto(){
  c = randomPos();
  colorPhase += random(10);
  orbitMod = random(1/400, 1/50);
  rotSpeed = random(0.01, random(0.01, 1));
}
function randomPos() {
  return { x: random(width), y: random(height) };
}
function jitter(p, v) {
  p.x += random(-v, v);
  p.y += random(-v, v);
}

function draw() {
  noStroke();
  translate(c.x, c.y);
  rotate(rot += rotSpeed);
  let lastDist = dist(pmouseX, pmouseY, mouseX, mouseY);
  mousePos = { x: mouseX, y: mouseY };
  let orbitDist = mouseY - height / 2
  orbitDist = map(sin(orbitMod * frameCount), -1, 1, 0, 200)
  let sz = random(2, 10)
  sz = map(orbitDist, 0, 200, 0.5, 7)
  let alpha = map(sin((alphaPhase + frameCount) / 100), -1, 1, 0, 1);
  fill(color(((frameCount / 50) + colorPhase) % 360, 100, 100, alpha));
  let pos = { x: 0, y: orbitDist };
  jitter(pos, 4);
  square(pos.x, pos.y, sz);
  ps = ps.slice(0, 200);
}
