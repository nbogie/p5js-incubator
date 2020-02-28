//TODO: add this as a brush to a design system
// to make variations on hand-drawn flowers
let circles;

let palette = ["#404040", "#d1f2a5", "#f56991", "#effab4", "#ffffff"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  colorMode(HSB, 360, 100, 100);
  circles = collect(40, ix => randomCircle());
}
function randomCircle() {
  let p = randomScreenPos();
  return {
    cX: p.x,
    cY: p.y,
    amp: randomGaussian(height * 0.1, 50),
    colr: random(palette),
    phase: random(1, 1000)
  };
}
function randomScreenPos() {
  return {
    x: randomGaussian(width / 2, width / 4),
    y: randomGaussian(height / 2, height / 4)
  };
}

function collect(n, fn) {
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
}
function randomColor() {
  colorMode(HSB, 360, 100, 100);
  return color(random(360), 60, 60);
}

function drawCircle({ cX, cY, amp, colr, phase }) {
  noStroke();
  //stroke(colr);
  // strokeWeight(0.5);
  fill(colr);
  push();
  translate(cX, cY);
  let angleStep = TWO_PI / 128;
  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += angleStep) {
    let xN = cos(angle) + 1;
    let yN = sin(angle) + 1;
    let x0 = cos(angle);
    let y0 = sin(angle);
    let radiusScale = map(
      noise(xN, yN, phase + frameCount / 300),
      0,
      1,
      0.8,
      1.1
    );
    let x = x0 * radiusScale * amp;
    let y = y0 * radiusScale * amp;
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}
updateCircle = c => {
  c.cX = mouseX;
  c.cY = mouseY;
};
function draw() {
  background(50);
  noStroke();
  //circles.forEach(updateCircle);
  circles.forEach(drawCircle);
}
