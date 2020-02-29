//TODO: add this as a brush to a design system
// to make variations on hand-drawn flowers
let circles;

let palette = ["#404040", "#d1f2a5", "#f56991", "#effab4", "#ffffff"];

function collect(n, fn) {
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
}

function restart() {
  circles = collect(40, ix => randomCircle());
}

//get a perlin noise value from a loop, at angle/TWO_PI
function loopedNoise(angle, phase) {
  let xN = cos(angle) + 1;
  let yN = sin(angle) + 1;
  return noise(xN, yN, phase + frameCount / 300);
}

function drawCircle({ cX, cY, amp, colr, phase }) {
  noStroke();
  fill(colr);
  push();
  translate(cX, cY);
  let angleStep = TWO_PI / 128;
  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += angleStep) {
    let xNormal = cos(angle);
    let yNormal = sin(angle);
    let noise = map(loopedNoise(angle, phase), 0, 1, 0.8, 1.1);
    let x = xNormal * noise * amp;
    let y = yNormal * noise * amp;
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
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

function randomColor() {
  colorMode(HSB, 360, 100, 100);
  return color(random(360), 60, 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  restart();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  colorMode(HSB, 360, 100, 100);
  restart();
  noLoop();
}

function draw() {
  background(50);
  noStroke();
  circles.forEach(drawCircle);
}

function mousePressed() {
  restart();
  redraw();
}
