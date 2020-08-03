//lots of inspiration from Matthew Epler's Youtube Series
// Designing Generative Systems with P5.js
// https://www.youtube.com/watch?v=rTqvf0BkTNE&list=PLyRZnpOSgMj3K8AV2I6UldnvTj6d_Zrf0

/*jslint browser: true */
/*global color, circle,square,key,random, createVector,createCanvas, windowWidth, windowHeight, rectMode, CENTER, noStroke, fill, push, pop, rotate, translate, background, lerpColor, rect, ellipse, mouseX, mouseY */
"use strict";
const seedHistory = [];
let showDebug = false;
let shouldDrawPalettePreview = false;
let gSeed = 0;
let THING_RADIUS = 50;
let colorBlack = "#202020";

const FaveColors = {
  paletteStrs: [
    "#F8B195,#F67280,#C06C84,#6C5B7B,#355C7D,#F8B195,#F67280,#C06C84|1001 stories|http://www.colourlovers.com/palette/1811244/1001_Stories",
    "#5E412F,#FCEBB6,#78C0A8,#F07818,#F0A830,#5E412F,#FCEBB6,#78C0A8|papua new guinea|http://www.colourlovers.com/palette/919313/Papua_New_Guinea",
    "#452632,#91204D,#E4844A,#E8BF56,#E2F7CE,#452632,#91204D,#E4844A|trance|http://www.colourlovers.com/palette/594151/t_r_a_n_c_e",
    "#F0D8A8,#3D1C00,#86B8B1,#F2D694,#FA2A00,#F0D8A8,#3D1C00,#86B8B1|koi carp|http://www.colourlovers.com/palette/656966/Koi_Carp",
    "#FF4E50,#FC913A,#F9D423,#EDE574,#E1F5C4,#FF4E50,#FC913A,#F9D423|dance to forget|http://www.colourlovers.com/palette/937624/Dance_To_Forget",
    "#99B898,#FECEA8,#FF847C,#E84A5F,#2A363B,#99B898,#FECEA8,#FF847C|coup de grace|http://www.colourlovers.com/palette/1098589/coup_de_gr%C3%A2ce",
    "#FF4242,#F4FAD2,#D4EE5E,#E1EDB9,#F0F2EB,#FF4242,#F4FAD2,#D4EE5E|wasabi suicide|http://www.colourlovers.com/palette/482416/Wasabi_Suicide",
    "yellow,yellow,gray||",
    "#c70000,#f4b600,#2d2bb4,black||",
    "black,gray,white||",
    "white||",
    "#FE4365,#FC9D9A,#F9CDAD,#C8C8A9,#83AF9B,#FE4365,#FC9D9A,#F9CDAD||",
    "#69D2E7,#A7DBD8,#E0E4CC,#F38630,#FA6900,#69D2E7,#A7DBD8,#E0E4CC||",
    "#556270,#4ECDC4,#C7F464,#FF6B6B,#C44D58,#556270,#4ECDC4,#C7F464||",
    "#E94E77,#D68189,#C6A49A,#C6E5D9,#F4EAD5|LoversInJapan by lovelyrita|http://www.colourlovers.com/palette/867235/LoversInJapan",
    "#00A0B0,#6A4A3C,#CC333F,#EB6841,#EDC951|Ocean Five by DESIGNJUNKEE|http://www.colourlovers.com/palette/1473/Ocean_Five",
    "#B9D7D9,#668284,#2A2829,#493736,#7B3B3B|Entrapped InAPalette by annajak|",
    "#D1F2A5,#EFFAB4,#FFC48C,#FF9F80,#F56991|mellon ball surprise by Skyblue2u|",
    "#00A8C6,#40C0CB,#F9F2E7,#AEE239,#8FBE00|fresh cut day by electrikmonk|"
  ],
  randomPalette: function() {
    const makePalette = str => {
      const [colorsStr, name, url] = str.split("|");
      return {
        colors: colorsStr.split(",").map(n => color(n)),
        name: name,
        url: url
      };
    };

    const palettes = FaveColors.paletteStrs.map(makePalette);
    return random(palettes);
  },
  randomMonoPalette: function() {
    const pal = Object.assign({}, FaveColors.randomPalette());
    pal.colors = sampleSize(pal.colors, 2);
    return pal;
  }
};

function randomizePalette() {
  gPalette = FaveColors.randomPalette();
}
function randomizeMonoPalette() {
  gPalette = FaveColors.randomMonoPalette();
}

let gPalette;

function keyPressed() {
  switch (key) {
    case "d":
      toggleShowDebug();
      break;
    case " ":
      newRandomSeed();
      redraw();
      break;
    case "p":
      prevRandomSeed();
      redraw();
      break;
    case "r":
      randomizePalette();
      redraw();
      break;
    case "m":
      randomizeMonoPalette();
      redraw();
      break;
  }
}

function newRandomSeed() {
  seedHistory.push(gSeed);
  gSeed = Math.floor(random(0, 999999));
  randomSeed(gSeed);
}

function prevRandomSeed() {
  if (seedHistory.length > 0) {
    gSeed = seedHistory.pop();
    randomSeed(gSeed);
  }
}

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
  return random(gPalette.colors);
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
  strokeWeight(1);
  square(0, 0, random(50, 100));
  pop();
}

function drawPetals(petalFn, extentScale) {
  push();
  const sz = random(10, 40);

  noFill();
  noStroke();
  random([true, false]) ? fill(randomColor()) : stroke(randomColor());
  strokeWeight(1);
  angleMode(RADIANS);
  const numPetals = random([6, 8]);
  const startRotation = TWO_PI / numPetals / 2;
  repeat(numPetals, ix => {
    push();
    rotate(startRotation + (ix * TWO_PI) / numPetals);
    translate(0, THING_RADIUS - (extentScale * sz) / 2);
    //rotate(PI / 4);
    petalFn(sz);
    pop();
  });
  pop();
}

function drawSquarePetals() {
  drawPetals(sz => square(0, 0, sz, sz / 8, sz / 8), 1.21);
}
function drawTrianglePetals() {
  const rotationAmt = random([PI, 0]);
  drawPetals(sz => {
    const d = sz / 2;
    push();
    rotate(rotationAmt);
    triangle(-d, -d, d, -d, 0, d);
    pop();
  }, 1);
}
function drawCirclePetals() {
  drawPetals(sz => circle(0, 0, sz / 2), 1);
}

function drawConcentricCircles() {
  const maxRad = THING_RADIUS * 0.9;
  noFill();
  strokeWeight(random([1, 1, 1, 10]));
  repeat(random([4, 6, 8]), (ix, lim) => {
    stroke(randomColor());
    circle(0, 0, (ix * maxRad) / lim);
  });
}
function randomColorOrTransparent() {
  return random([randomColor(), createEmptyColor()]);
}
function drawSteppedHexagons() {
  repeat(random([4, 6, 8, 10]), (ix, lim) => {
    drawHexagon((ix / lim) * THING_RADIUS, false);
  });
}
function drawSpiral() {
  const radius = THING_RADIUS;

  strokeWeight(1);
  stroke(randomColor());
  push();

  const rotAmt = random(0.18, 0.5) * random([1, -1]);

  const fragmentFn = random([
    r => line(0, r, 20, r),
    r => circle(0, r, map(r, 1, radius, 1, 10)),
    r => square(0, r, map(r, 1, radius, 1, 10))
  ]);

  for (let r = radius; r > 1; r--) {
    fragmentFn(r);
    rotate(rotAmt);
  }
  pop();
}

function drawOuterHexagon() {
  const radius = THING_RADIUS;
  drawHexagon(radius, random([false, false, false, true]));
}

function drawHexagon(radius, filled = false) {
  const sliceAngle = TWO_PI / 6;
  const startAngle = filled ? PI / 6 : 0;
  push();
  strokeWeight(1);
  fill(filled ? randomColor() : createEmptyColor());
  stroke(randomColor());
  beginShape();
  repeat(6, ix => {
    const p = pointOnCircle(radius, startAngle + sliceAngle * ix);
    vertex(p.x, p.y);
  });
  endShape(CLOSE);
  pop();
}

function drawRadialLines() {
  const numLines = random([6, 4, 8, 12]);
  const sliceAngle = TWO_PI / numLines;
  const startRadiusStep = random([1, 2, 3, 4, 5]);
  const endRadiusStep = startRadiusStep + random(1, 6 - startRadiusStep);
  const endRadius = (endRadiusStep * THING_RADIUS) / 6;
  const startRadius = (startRadiusStep * THING_RADIUS) / 6;

  noFill();
  strokeWeight(1);
  stroke(randomColor());
  push();
  repeat(numLines, ix => {
    rotate(sliceAngle);
    line(startRadius, 0, endRadius, 0);
  });
  pop();
}

function mouseDragged() {
  THING_RADIUS = map(mouseX, 0, width, 10, width / 12);
  redraw();
}

function textLabel(msg, x, y) {
  const padding = 30;
  const h = textAscent(msg) + textDescent(msg);
  const w = textWidth(msg);
  fill(color(255, 230)); //"white");
  strokeWeight(2);
  stroke("#404040");
  rect(x + w / 2, y - textDescent(msg), w + padding, h + padding, 5, 5);
  noStroke();
  fill("#404040");
  text(msg, x, y);
}
function draw() {
  background("whitesmoke");
  const numRows = height / (6 * THING_RADIUS + 2);
  const numCols = width / (6 * THING_RADIUS + 2);

  drawGridOfThings(numRows * 2, numCols * 2, drawThing);
  if (showDebug) {
    textSize(24);
    textLabel(gPalette.name || "untitled", 100, height * 0.8);
    textLabel("seed: " + gSeed, 100, height * 0.91);
  }
}

function drawGridOfThings(numRows, numCols, drawThingFn) {
  const ySpacing = height / numRows;
  const xSpacing = width / numCols;
  const xStart = THING_RADIUS * 1.5;
  const yStart = THING_RADIUS * 1.5;

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

function randInt(min, max) {
  return Math.floor(random(min, max + 1));
}

function atLeastTwoOf(fns) {
  const pickedFns = sampleSize(fns, randInt(2, fns.length));
  pickedFns.forEach(f => f());
}

function drawGuideLines() {
  stroke("gray");
  strokeWeight(1);
  noFill();
  circle(0, 0, THING_RADIUS);
}

function drawThing() {
  // drawGuideLines();
  atLeastTwoOf([
    //x => repeat(random(1, 2), drawSquare),
    random([drawSquarePetals, drawCirclePetals, drawTrianglePetals]),
    drawOuterHexagon,
    //drawSpiral,
    random([drawSteppedHexagons, drawConcentricCircles]),
    drawRadialLines
  ]);
}
function drawNewThing() {
  // drawGuideLines();
  drawBlockTattoo();
}
function makeLineData() {
  const data = [];
  for (let i = 0; i < 5; i++) {
    data.push(random([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2]));
  }
  return data;
}

function drawBlockTattoo() {
  fill(colorBlack);
  const sz = THING_RADIUS;
  translate(0, -sz);
  noStroke();
  repeat(6, (ix, lim) => {
    const xs = sampleSize([-2, -1, 0, 1, 2], 2);
    const lineData = makeLineData();
    lineData.forEach((mark, jx) => {
      push();
      translate((-2 + jx) * sz * 0.4, 0);
      if (mark) {
        mark === 1 ? rect(0, 0, sz * 0.4, sz * 0.15) : circle(0, 0, sz * 0.09);
      }
      pop();
    });
    translate(0, sz / 3);
  });
}
THING_RADIUS;
function toggleShowDebug() {
  showDebug = !showDebug;
}

function sampleSize(arr, num){
  return shuffle(arr).slice(num);
}