/*jslint browser: true */
/*global _, color, createCanvas, windowWidth, windowHeight, rectMode, CENTER, noStroke, fill, push, pop, rotate, translate, background, lerpColor, rect, ellipse, ellipseMode, mouseX, mouseY, random, console,noLoop, redraw, round,randomSeed, strokeWeight, stroke, FaveColors, key, noCursor,colorMode, HSB, TWO_PI, TweenLite, Elastic, textSize, text, RGB*/


// MASTER COPY NOT IN GIT YET

"use strict";
p5.disableFriendlyErrors = true; // disables FES

var particles = [];
let shouldDrawText = false;
let frozen = false;
let numParticles = 40;
let withAlpha = false;
let gSaturation = 100;
let gGrayscale = true;
let gAngleDivisions = 4;
let gColors = [];
let gGenColor = false;
let gRotVariance = 0.05;
const PaletteMode = Object.freeze({
  GRAYSCALE: Symbol("grayscale"),
  GENERATED: Symbol("generated"),
  PALETTE: Symbol("palette")
});

let gPaletteMode = PaletteMode.GRAYSCALE;

const FaveColors = {
  paletteStrs: [
    "#F8B195,#F67280,#C06C84,#6C5B7B,#355C7D,#F8B195,#F67280,#C06C84", //1001 stories http://www.colourlovers.com/palette/1811244/1001_Stories
    "#5E412F,#FCEBB6,#78C0A8,#F07818,#F0A830,#5E412F,#FCEBB6,#78C0A8", //papua new guinea http://www.colourlovers.com/palette/919313/Papua_New_Guinea
    "#452632,#91204D,#E4844A,#E8BF56,#E2F7CE,#452632,#91204D,#E4844A", //trance http://www.colourlovers.com/palette/594151/t_r_a_n_c_e
    "#F0D8A8,#3D1C00,#86B8B1,#F2D694,#FA2A00,#F0D8A8,#3D1C00,#86B8B1", //koi carp http://www.colourlovers.com/palette/656966/Koi_Carp
    "#FF4E50,#FC913A,#F9D423,#EDE574,#E1F5C4,#FF4E50,#FC913A,#F9D423", //dance to forget http://www.colourlovers.com/palette/937624/Dance_To_Forget
    "#99B898,#FECEA8,#FF847C,#E84A5F,#2A363B,#99B898,#FECEA8,#FF847C", //coup de grace http://www.colourlovers.com/palette/1098589/coup_de_gr%C3%A2ce
    "#FF4242,#F4FAD2,#D4EE5E,#E1EDB9,#F0F2EB,#FF4242,#F4FAD2,#D4EE5E", //wasabi suicide http://www.colourlovers.com/palette/482416/Wasabi_Suicide
    "yellow,yellow,gray",
    "#c70000,#f4b600,#2d2bb4,black",
    "#FE4365,#FC9D9A,#F9CDAD,#C8C8A9,#83AF9B,#FE4365,#FC9D9A,#F9CDAD",
    "#69D2E7,#A7DBD8,#E0E4CC,#F38630,#FA6900,#69D2E7,#A7DBD8,#E0E4CC",
    "#556270,#4ECDC4,#C7F464,#FF6B6B,#C44D58,#556270,#4ECDC4,#C7F464",
    "#E94E77,#D68189,#C6A49A,#C6E5D9,#F4EAD5", // ["LoversInJapan by lovelyrita"](http://www.colourlovers.com/palette/867235/LoversInJapan)
    "#00A0B0,#6A4A3C,#CC333F,#EB6841,#EDC951", // ["Ocean Five by DESIGNJUNKEE"](http://www.colourlovers.com/palette/1473/Ocean_Five)
    "#B9D7D9,#668284,#2A2829,#493736,#7B3B3B", // "Entrapped InAPalette by annajak",
    "#D1F2A5,#EFFAB4,#FFC48C,#FF9F80,#F56991", // "mellon ball surprise by Skyblue2u"
    "#00A8C6,#40C0CB,#F9F2E7,#AEE239,#8FBE00" // "fresh cut day by electrikmonk"
  ],
  randomPalette: () =>
    random(FaveColors.paletteStrs)
      .split(",")
      .map(n => color(n))
};

function randomizePalette() {
  gColors = FaveColors.randomPalette();
}

function restartAll() {
  randomColorPaletteMode();
  randomizePalette();
  gRotVariance = random([0.05, 0, 0, 0]);

  gAngleDivisions = random() > 0.8 ? 8 : 4;

  numParticles = random([40, 40, 200, 100]);
  withAlpha = numParticles < 50;
  gSaturation = withAlpha ? 100 : random([100, 100, 60]);
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push(makeParticle());
  }
  particles.forEach(p => {
    let pos = randomScreenPosition();
    createAnimTo(p, pos.x, pos.y);
  });
  multiAttractCluster(0.7);
}

function randomColor() {
  switch (gPaletteMode) {
    case PaletteMode.GRAYSCALE:
      return color(random(255), withAlpha ? 100: 255);
    
    case PaletteMode.GENERATED:
      colorMode(HSB, 100);
      return color(random(100), gSaturation, 100, withAlpha ? 50 : 100);
    
    case PaletteMode.PALETTE:
      return random(gColors);
  }
}


function randomColorPaletteMode() {
  gPaletteMode = random([
    PaletteMode.GRAYSCALE,
    PaletteMode.GENERATED,
    PaletteMode.GENERATED,
    PaletteMode.PALETTE,
    PaletteMode.PALETTE,
    PaletteMode.PALETTE
  ]);
}
function makeParticle() {
  return {
    x: windowWidth / 2,
    y: windowHeight / 2,
    rot: 0,
    state: "uninit",
    size: 40,
    col: randomColor()
  };
}

function snapTo(v, grid) {
  return round(v / grid) * grid;
}
function createAnimTo(
  obj,
  targetX = windowWidth / 2,
  targetY = windowHeight / 2,
  targetRot = TWO_PI,
  targetSize = 40
) {
  targetRot = random(-gRotVariance, gRotVariance) + snapTo(targetX % TWO_PI, TWO_PI / gAngleDivisions);
  //create a tween that changes the value of the score property of the given object from 0 to 100 over the course of 20 seconds.
  TweenLite.to(obj, random(3, 5), {
    x: targetX,
    y: targetY,
    rot: targetRot,
    size: targetSize,
    ease: Elastic.easeOut.config(1, 0.5)
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  particles = [];
  frozen = false;
  restartAll();
  setInterval(timedMover, 120);
  setInterval(restartAll, 40000);
  setInterval(autoPlay, 6000);
  noCursor();
}
function noRecentInteraction() {
  return true;
}

function autoPlay() {
  if (noRecentInteraction()) {
    multiAttractCluster();
    shortFreeze(4000);
  }
}
function timedMover() {
  if (!frozen) {
    sendOneElsewhere();
  }
}

function drawParticle(p) {
  push();
  noStroke();
  //stroke(0);
  translate(p.x, p.y);
  if (shouldDrawText) {
    fill("white");
    textSize(32);
    text(p.state, -70, 60);
  }
  rotate(p.rot);
  fill(p.col);
  rectMode(CENTER);
  rect(0, 0, p.size, p.size);
  pop();
}

function draw() {
  colorMode(RGB);
  background(color(255));
  //background(frozen ? color(255) : color(230));
  noStroke();
  fill(0);
  ellipseMode(CENTER);
  ellipse(mouseX, mouseY, 10, 12);
  fill(255);
  ellipse(mouseX, mouseY, 2, 2);
  particles.forEach(drawParticle);
}

function randomPadded(max, padRatio) {
  let pad = max * padRatio;
  return random(pad, max - pad);
}
function randomScreenPosition() {
  return {
    x: randomPadded(windowWidth, 0.05),
    y: randomPadded(windowHeight, 0.1)
  };
}
function randomSize() {
  return random(10, 100);
}
function sendOneElsewhere() {
  let pos = randomScreenPosition();
  let p = random(particles);
  createAnimTo(p, pos.x, pos.y, random(TWO_PI), randomSize());
}

function mousePos() {
  return {
    x: mouseX,
    y: mouseY
  };
}
function aroundMouse(amt) {
  return aroundPos(mousePos(), amt);
}

function aroundPos(pos, amt) {
  let v = amt / 2;
  return {
    x: pos.x + random(-v, v),
    y: pos.y + random(-v, v)
  };
}

function attractClusterTo(targetPos, probability = null) {
  if (probability === null) {
    probability = random([20, 30, 50, 80]) / numParticles;
  }
  particles.forEach(p => {
    if (random() < probability) {
      let pos = aroundPos(targetPos, 100);
      createAnimTo(p, pos.x, pos.y, random(TWO_PI), randomSize());
    }
  });
}
function multiAttractCluster(probability = null) {
  _.times(random([1, 2, 3, 4, 5]), ix => {
    let pos = randomScreenPosition();
    attractClusterTo(pos, probability);
  });
}
function shortFreeze(dur = 5000) {
  setTimeout(v => (frozen = true), 1000);
  setTimeout(v => (frozen = false), dur);
}

function mousePressed() {
  attractClusterTo({ x: mouseX, y: mouseY });
  shortFreeze();
}

function keyPressed() {
  if (key === " ") {
    restartAll();
  } else {
    multiAttractCluster();
    shortFreeze(10000);
  }
}