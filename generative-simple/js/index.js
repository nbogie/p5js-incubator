"use strict";
let shouldDrawPalettePreview = false;

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
  gPalette = FaveColors.randomPalette();
}

let gPalette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  randomizePalette();
  noLoop();
  ellipseMode(CENTER);
  rectMode(CENTER);
}
function repeat(n, fn) {
  for (let i = 0; i < n; i++) {
    fn(i, n);
  }
}
function randomColor() {
  return random(gPalette);
}
function randomPos() {
  return { x: random(width), y: random(height) };
}

function pointOnCircle(radius, angleRads) {
  return {
    x: radius * cos(angleRads),
    y: radius * sin(angleRads)
  };
}

function createEmptyColor() {
  return color(0, 1);
}

function drawSquare() {
  push();
  rotate(random([0, PI / 4]));
  fill(randomColorOrTransparent());
  stroke(randomColor());
  strokeWeight(10);
  square(0, 0, random(50, 100));
  pop();
}

function drawPetals(petalFn) {
  push();
  const sz = random(10, 40);
  fill(random([randomColor(), createEmptyColor()]));
  stroke(randomColor());
  strokeWeight(2);
  angleMode(RADIANS);
  const numPetals = random([6, 8]);
  for (let i = 0; i < numPetals; i++) {
    push();
    rotate((i * TWO_PI) / numPetals);
    translate(0, 50);
    petalFn(sz);
    pop();
  }
  pop();
}

function drawSquarePetals() {
  drawPetals(sz => square(0, 0, sz));
}
function drawCirclePetals() {
  drawPetals(sz => circle(0, 0, sz / 2));
}

function drawConcentricCircles() {
  const maxRad = 50;
  strokeWeight(random([2, 10]));
  repeat(random([4, 6, 8]), (ix, lim) => {
    noFill();
    stroke(randomColor());
    circle(0, 0, (ix * maxRad) / lim);
  });
}
function randomColorOrTransparent() {
  return random([randomColor(), createEmptyColor()]);
}
function drawHexagon() {
  push();
  //rotate(TWO_PI / 12);
  const radius = 60;
  const sliceAngle = TWO_PI / 6;
  const startAngle = 0;
  strokeWeight(2);
  fill(randomColorOrTransparent());
  stroke(randomColor());
  beginShape();
  for (let i = 0; i < 7; i++) {
    const next = pointOnCircle(radius, startAngle + sliceAngle * i);
    vertex(next.x, next.y);
  }
  endShape();
  pop();
}

function drawRadialLines() {
  push();
  //rotate(TWO_PI / 12);
  const endRadius = 60;
  const startRadius = random([1, 2, 3, 4, 5]) * 10;
  const startAngle = 0;
  strokeWeight(2);
  stroke(randomColor());
  const numLines = random([6, 4, 8, 12]);
  const sliceAngle = TWO_PI / numLines;

  for (let i = 0; i < numLines; i++) {
    const inner = pointOnCircle(startRadius, startAngle + sliceAngle * i);
    const outer = pointOnCircle(endRadius, startAngle + sliceAngle * i);
    line(inner.x, inner.y, outer.x, outer.y);
  }
  pop();
}

function draw() {
  background("white");
  const numRows = 4;
  const numCols = 6;
  drawGridOfThings(numRows, numCols, drawThing);
  //  drawGridOfThings(numRows, numCols, drawHexagon);
}

function drawGridOfThings(numRows, numCols, drawThingFn) {
  const ySpacing = height / numRows;
  const xSpacing = width / numCols;
  const yStart = 80;
  const xStart = 80;

  for (let row = 0; row < numRows; row++) {
    const y = yStart + row * ySpacing;
    for (let col = 0; col < numCols; col++) {
      const x = xStart + col * xSpacing;
      push();
      translate(x, y);
      drawThingFn();
      pop();
    }
  }
}

function maybe(fn) {
  Math.random() > 0.5 && fn();
}

function atLeastOneOf(fns) {
  const shuffledFns = _.shuffle(fns);
  if (fns) {
    const maxChoicePacked = Math.pow(2, fns.length);
    let choicesPacked = int(random(1, maxChoicePacked));
    shuffledFns.forEach(f => {
      const include = choicesPacked & 1;
      include && f();
      choicesPacked = choicesPacked >> 1;
    });
  }
}

function drawThing() {
  atLeastOneOf([
    //    x => repeat(random(1, 2), drawSquare),
    random([drawSquarePetals, drawCirclePetals]),
    drawHexagon,
    drawRadialLines,
    drawConcentricCircles
  ]);
}
