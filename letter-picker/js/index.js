"use strict";

//TODO: key mechanisms:
// Get HTML DOM element position: getBoundingClientRect():
//  https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
// Absolute canvas positioning and "z-index -1" styling to place canvas in same location as other page content.
// Positioning your canvas:
// https://github.com/processing/p5.js/wiki/Positioning-your-canvas
let myCanvas;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent(document.body);
  myCanvas.style("z-index", "-1");
  myCanvas.position(0, 0);
}

function randomPos() {
  return {
    x: random(width),
    y: random(height)
  };
}

function draw() {
  background("whitesmoke");
  fill(100);

  for (let i = 0; i < 100; i++) {
    const p = {
      x: width * noise(frameCount / 1000 + i),
      y: height * noise(i + 2000) + 40 * noise(20 * i + frameCount / 200)
    };
    stroke("blue");
    strokeWeight(3);
    point(p.x, p.y);
  }

  rectMode(CENTER);

  const el = document.getElementById("shake");
  var bound = el.getBoundingClientRect();
  noFill();
  rectMode(CORNER);
  stroke("red");
  rect(bound.x, bound.y, bound.width, bound.height);

  stroke("green");
  rect(bound.left, bound.y, 3, 3);
  rect(bound.right, bound.y, 3, 3);
  for (let p of list) {
    circle(p.x, p.y, 30);
  }
}
const list = [];

function breakTextIntoIndividualElements(textElemId) {
  const origEl = document.getElementById(textElemId);
  const origStr = origEl.textContent;
  removeAllChildrenFromEl(origEl);
  const newElems = origStr
    .trim()
    .split(" ")
    .forEach(word => {
      const span = document.createElement("span");
      span.innerText = word;
      origEl.appendChild(span);
      origEl.appendChild(document.createTextNode(" "));
    });
}
function removeAllChildrenFromEl(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}
function tearElementFromPage(elemId) {
  const el = document.getElementById("shake");
  el.style = "visibility:hidden";
  gWordList.push();
}
function mousePressed() {
  breakTextIntoIndividualElements("div1");
  tearElementFromPage("shake");
}
function mouseDragged() {
  fill("yellow");
  list.push({ x: mouseX, y: mouseY });
}
