//see also
// https://stackoverflow.com/questions/33419953/animated-svg-circles-timer-and-progress

function setup() {
  createCanvas(windowWidth, windowHeight);
  p5.disableFriendlyErrors = true;

  frameRate(20);
}

function minutesToMillis(mins) {
  return mins * 60 * 1000;
}

function randomPos() {
  return {
    x: random(width),
    y: random(height)
  };
}

function draw() {
  clear();

  //add a dynamic background just to show the main trail is transparent
  //drawNoisyBackground();

  push();
  translate(width / 2, height / 2);

  let targetDurationInMinutes = 0.25;
  let fractionTimeElapsed = millis() / minutesToMillis(targetDurationInMinutes);
  let radius = 200;
  drawTrail(radius * 2, 30, fractionTimeElapsed);
  drawOrbitingCircle(radius, 30, fractionTimeElapsed);
  pop();
}

function drawOrbitingCircle(orbitRadius, size, fractionTimeElapsed) {
  let x = orbitRadius * cos(TWO_PI * fractionTimeElapsed);
  let y = orbitRadius * sin(TWO_PI * fractionTimeElapsed);
  fill("white");
  //noStroke();
  strokeWeight(5);
  circle(x, y, size);
}

function drawTrail(orbitRadius, thickness, fractionTimeElapsed) {
  noFill();
  strokeWeight(thickness);
  stroke(100, 70);
  strokeCap(SQUARE);
  arc(0, 0, orbitRadius, orbitRadius, 0, TWO_PI * fractionTimeElapsed);
}

function drawNoisyBackground() {
  strokeWeight(0.5);
  stroke(random([255, 0]), random(20, 60));
  for (let i = 0; i < 4; i++) {
    let p = randomPos();
    line(p.x, 0, p.x, height);
  }
}
