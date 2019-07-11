"use strict";
const stars = [];
const vehicles = [];
const particles = [];
const asteroids = [];
const gTargets = [];
const gNumTargets = 6;
const gNumVehicles = 6;
const gAsteroids = [];
const gShots = [];
const worldWidth = 6000;
const worldHeight = 5000;
let cameraPos;
let cameraMoveSpeed = 5;
const maxScreenShakeAmount = 10;

let screenShakeAmount = 0;
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
  createPalettes: function() {
    const makePalette = str => {
      const [colorsStr, name, url] = str.split("|");
      return {
        colors: colorsStr.split(",").map(n => color(n)),
        name: name,
        url: url
      };
    };

    const palettes = FaveColors.paletteStrs.map(makePalette);
    return palettes;
  },
  randomPalette: function() {
    return random(FaveColors.createPalettes());
  },

  randomBigPalette: function(minSize) {
    return random(
      FaveColors.createPalettes().filter(p => p.colors.length >= minSize)
    );
  },
  randomMonoPalette: function() {
    const pal = Object.assign({}, FaveColors.randomPalette());
    pal.colors = _.sample(pal.colors, 2);
    return pal;
  }
};

function randomizePalette() {
  gPalette = FaveColors.randomPalette();
}
function randomizeBigPalette() {
  gPalette = FaveColors.randomBigPalette(5);
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
function createVehicle() {
  return {
    pos: randomWorldPos(),
    vel: createVector(0, 0),
    accel: createVector(0, 0),
    target: undefined,
    fuel: 100,
    desiredVector: createVector(0, 0),
    maxSteeringForce: 0.2,
    maxSpeed: random(2, 10),
    facing: random(TWO_PI),
    hue: random(0, 100),
    color: randomColor(),
    traction: 0.3,
    steer: createVector(0, 0),
    canShoot: false,
    lastShot: -99999,
    shotDelay: 100,
    trail: createTrail()
  };
}
function createTrail() {
  return { particles: [] };
}

const resTypes = [
  { label: "fuel", hue: 55 },
  { label: "laser", hue: 30 },
  { label: "explosive", hue: 0 },
  { label: "magic", hue: 80 }
];
function addAsteroid(opts) {
  asteroids.push(createAsteroidAt(opts));
}
function createAsteroid() {
  return createAsteroidAt({ pos: randomWorldPos() });
}
function createAsteroidAt(opts) {
  const sz = opts.sizeCategory || random([1, 2, 3, 4]);
  return {
    live: true,
    pos: opts.pos.copy(),
    vel: p5.Vector.random2D(),
    resType: random(resTypes),
    sizeCategory: sz,
    radius: sz * 10,
    hp: sz * 5,
    rotation: random(TWO_PI),
    rotationSpeed: random(-0.1, 0.1)
  };
}

function createParticle() {
  return createParticleAt(createVector(random(width), random(height)));
}

function createParticleAt(pos) {
  return {
    pos: pos.copy(),
    vel: p5.Vector.random2D(),
    hue: random(10),
    radius: random(0.5, 3),
    color: randomColor(),
    life: 1
  };
}

function createParticles(n) {
  repeat(n, ix => {
    particles.push(createParticle());
  });
}
function createVehicles(n) {
  repeat(n, ix => vehicles.push(createVehicle()));
}
function createAsteroids(n) {
  repeat(n, ix => asteroids.push(createAsteroid()));
}
function createStarfield() {
  repeat(1000 * numberOfWorldPages(), ix =>
    stars.push({
      pos: randomWorldPos(),
      sz: random(0.5, 3),
      strength: random(100)
    })
  );
}
function setPaletteForResources() {
  randomizeBigPalette();
  resTypes.forEach((rt, ix) => {
    rt.color = gPalette.colors[ix];
  });
}
function numberOfWorldPages() {
  return Math.pow(worldWidth / width, 2);
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  cameraPos = createVector(0, 0);
  frameRate(50);
  angleMode(RADIANS);
  randomizeBigPalette();
  setPaletteForResources();
  //vehicles.push(createVehicle());
  createVehicles(gNumVehicles);
  createAsteroids(10 * numberOfWorldPages());
  createStarfield();

  background("black");
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
  return createVector(random(width), random(height));
}
function randomWorldPos() {
  return createVector(
    random(-worldWidth / 2, worldWidth / 2),
    random(-worldHeight / 2, worldHeight / 2)
  );
}

function randomColorOrTransparent() {
  return random([randomColor(), createEmptyColor()]);
}

function drawParticle(p) {
  if (p.life <= 0) {
    return;
  }
  push();
  translateForScreenCoords(p.pos);
  colorMode(HSB, 100);
  fill(color(p.hue, 100, 100, map(p.life, 0.8, 1, 0, 100)));
  noStroke();
  const sz = map(p.life, 0, 1, 0, 2);
  circle(0, 0, sz);
  pop();
}

function translateForScreenCoords(pos, labelled = false) {
  const screenCoords = pos.copy().sub(cameraPos);
  translate(Math.round(pos.x - cameraPos.x), Math.round(pos.y - cameraPos.y));
  if (labelled) {
    fill("white");
    textSize(10);
    text(`${Math.round(screenCoords.x)},${Math.round(screenCoords.y)}`, 20, 0);
  }
}
function posToString(p) {
  return `${Math.round(p.x)}, ${Math.round(p.y)}`;
}
function drawVehicle(p) {
  drawTrail(p.trail);
  push();
  translateForScreenCoords(p.pos);
  colorMode(HSB, 100);

  fill(p.canShoot ? color(p.hue, 40, 100) : "gray");
  noStroke();
  const sz = 10;
  push();
  rotate(p.facing);
  beginShape();
  vertex(-sz, -sz);
  vertex(-sz, sz);
  vertex(sz, 0);
  endShape();

  pop();

  drawVec(p.desiredVector, 100, 0, 1, color(0, 0, 100, 20), 1);
  drawVec(p.vel, 50, 0, p.maxSpeed, color(30, 0, 100, 30), 4);
  drawVec(p.steer, 30, 0, p.maxSteeringForce, color(0, 100, 100, 25), 1);

  pop();
}

function drawTrail(trail) {
  trail.particles.forEach(p => {
    push();
    translateForScreenCoords(p.pos);

    noStroke();
    fill(p.color);

    square(0, 0, p.radius * 2);
    pop();
  });
}
function drawVec(vec, len, minMag, maxMag, c, lineWidth = 1) {
  push();
  rotate(vec.heading());
  stroke(c);
  strokeWeight(lineWidth);
  line(0, 0, map(vec.mag(), 0, maxMag, 0, len), 0);
  pop();
}
function addTarget(pos) {
  gTargets.unshift(pos);
  gTargets.splice(gNumTargets);
  vehicles.forEach((v, ix) => {
    v.target = gTargets[ix % gTargets.length];
  });
}
function mouseWorldPos() {
  return cameraPos.copy().add(mousePos());
}

function mousePos() {
  return createVector(mouseX, mouseY);
}

function mouseMoved() {}
function mousePressed() {
  addAsteroid({ pos: mouseWorldPos() });
}
function updateParticle(p) {
  p.pos.x += p.vel.x;
  p.pos.y += p.vel.y;
  p.life -= random(0.001, 0.01);
}
function updateAsteroid(p) {
  if (p.live) {
    p.pos.x += p.vel.x;
    p.pos.y += p.vel.y;
    if (p.pos.x < -worldWidth / 2) {
      p.pos.x += worldWidth / 2;
    }
    if (p.pos.x > worldWidth / 2) {
      p.pos.x -= worldWidth / 2;
    }

    if (p.pos.y < -worldHeight / 2) {
      p.pos.y += worldHeight / 2;
    }
    if (p.pos.y > worldHeight / 2) {
      p.pos.y -= worldHeight / 2;
    }
    p.rotation += p.rotationSpeed;
  }
}
function isColliding(a, s) {
  return dist(a.pos.x, a.pos.y, s.pos.x, s.pos.y) < a.radius + s.radius;
}
function shatterAsteroid(a) {
  if (a.sizeCategory >= 2) {
    addAsteroid({ pos: a.pos.copy(), sizeCategory: a.sizeCategory - 1 });
    addAsteroid({ pos: a.pos.copy(), sizeCategory: a.sizeCategory - 1 });
    if (nearCamera(a.pos)) {
      screenShake(a.sizeCategory);
    }
  }
}
function distFromCamera(p) {
  return p5.Vector.dist(
    cameraPos.copy().add(createVector(width / 2, height / 2)),
    p
  );
}
function nearCamera(pos) {
  return distFromCamera(pos) < height;
}

function screenShake(amt) {
  screenShakeAmount += amt;
  if (screenShakeAmount > maxScreenShakeAmount) {
    screenShakeAmount = maxScreenShakeAmount;
  }
}

function updateShot(p) {
  if (p.live) {
    p.pos.x += p.vel.x;
    p.pos.y += p.vel.y;
    asteroids
      .filter(a => a.live)
      .forEach(a => {
        if (isColliding(a, p)) {
          a.hp -= p.damage;
          p.live = false;
          if (a.hp <= 0) {
            a.live = false;
            shatterAsteroid(a);
          }
        }
      });
    p.life -= random(0.001, 0.01);
  }
}

function updateVehicle(p) {
  p.pos.add(p.vel);
  const vel = createVector(p.vel.x, p.vel.y);

  const currPos = createVector(p.pos.x, p.pos.y);

  if (p.target && p.target.live) {
    const targetPos = createVector(p.target.pos.x, p.target.pos.y);
    const desired = p5.Vector.sub(targetPos, currPos);
    desired.normalize();
    desired.mult(p.maxSpeed);
    p.desiredVector = desired.copy().normalize();
    p.facing = p.desiredVector
      .copy()
      .normalize()
      .heading();

    //steering = desired minus velocity
    const steer = p5.Vector.sub(desired, vel);
    steer.limit(p.maxSteeringForce);
    p.steer = steer.copy();
    p.accel.add(steer);
    p.fuel -= p.accel.mag();
  } else {
    p.target = acquireTarget(p);
  }
  p.vel.add(p.accel);

  updateShooting(p);

  p.trail.particles.forEach(updateParticle);

  //reset accel for next time

  p.life -= random(0.001, 0.01);
  const particle = createParticleAt(p.pos);
  particle.vel = p.accel
    .copy()
    .mult(20)
    .rotate(PI + random(-0.3, 0.3));
  addParticle(particle, p.trail.particles);
  p.accel.mult(0);
}

function acquireTarget(vehicle) {
  const closeAsteroids = asteroids.filter(
    a => a.pos.dist(vehicle.pos) < height
  );
  return random(closeAsteroids.length > 0 ? closeAsteroids : asteroids);
}

function addShot(opts) {
  colorMode(HSB, 100);
  const shotSpread = PI / 32;
  const sz = Math.pow(random([2, 3, 4, 5, 6, 7]), 2);
  const vel = opts.vel
    .copy()
    .normalize()
    .mult(sz);
  gShots.unshift({
    live: true,
    pos: opts.pos.copy().add(vel),
    rotation: opts.rotation,
    vel: opts.vel.copy().rotate(random(-shotSpread, shotSpread)),
    radius: sz,
    damage: sz,
    color: color(random(50, 70), 100, 100, 100)
  });
  gShots.splice(100);
}
function drawShot(s) {
  if (s.live) {
    push();
    translateForScreenCoords(s.pos);
    fill(s.color);
    rotate(s.rotation);
    rect(0, 0, s.radius, s.radius / 2);
    pop();
  }
}
function drawAsteroid(a) {
  if (a.live) {
    push();
    translateForScreenCoords(a.pos);

    colorMode(HSB, 100);
    push();
    rotate(a.rotation);
    fill(a.resType.color);
    noStroke();
    square(0, 0, a.radius * 2, 6, 6);
    pop();
    textSize(12);
    stroke("black");

    strokeWeight(2);
    text(a.hp, 20, 20);
    pop();
  }
}

function shootIfTime(p) {
  const ms = millis();
  if (ms - p.lastShot > p.shotDelay) {
    addShot({
      pos: p.pos,
      vel: p.vel
        .copy()
        .normalize()
        .mult(40)
        .add(p.vel),
      rotation: p.facing
    });
    p.lastShot = ms;
  }
}
function updateShooting(p) {
  const angleOff = p.desiredVector.angleBetween(p.vel);

  p.canShoot = angleOff < TWO_PI / 36;
  if (p.canShoot) {
    shootIfTime(p);
  }
}

function addParticle(p, ps) {
  ps.unshift(p);
  ps.splice(100);
}
function onScreen(pos, radius) {
  return (
    pos.x + radius >= cameraPos.x &&
    pos.x - radius <= cameraPos.x + width &&
    pos.y + radius >= cameraPos.y &&
    pos.y - radius <= cameraPos.y + height
  );
}
function drawStarfield() {
  stars
    .filter(s => onScreen(s.pos, 5))
    .forEach(s => {
      push();
      translateForScreenCoords(s.pos);

      colorMode(HSB, 100);
      fill(color(0, 0, 100, s.strength));
      noStroke();
      circle(0, 0, s.sz);
      pop();
    });
}

function draw() {
  background(0);
  push();
  drawStarfield();

  drawGridLines();
  gShots.forEach(drawShot);
  asteroids.forEach(drawAsteroid);
  particles.forEach(drawParticle);
  vehicles.forEach(drawVehicle);
  gShots.forEach(updateShot);
  asteroids.forEach(updateAsteroid);
  particles.forEach(updateParticle);
  vehicles.forEach(updateVehicle);
  fill("white");
  vehicles
    .filter(v => v.target && v.target.live)
    .forEach(v => drawTarget(v.target));
  pop();
  fill("white");
  textSize(12);
  text(
    JSON.stringify({
      x: Math.round(cameraPos.x),
      y: Math.round(cameraPos.y)
    }),
    50,
    600
  );

  updateCamera(cameraPos);
}

function drawGridLines() {
  const numCols = (8 * worldWidth) / width;
  const numRows = (8 * worldHeight) / width;
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      const pos = createVector(
        (col * width) / 2 - worldWidth / 2,
        (row * width) / 2 - worldHeight / 2
      );
      push();
      translateForScreenCoords(pos);
      strokeWeight(0.1);
      colorMode(RGB, 255);
      stroke(color(255, 255, 255, 120));
      line(0, -width / 2, 0, width / 2);
      line(-width / 2, 0, width / 2, 0);
      pop();
    }
  }
}
function updateCamera(cameraPos) {
  if (keyIsDown(LEFT_ARROW)) {
    cameraPos.x += cameraMoveSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    cameraPos.x -= cameraMoveSpeed;
  }
  if (keyIsDown(UP_ARROW)) {
    cameraPos.y += cameraMoveSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    cameraPos.y -= cameraMoveSpeed;
  }
  if (vehicles.length > 0) {
    trackVehicleWithCamera(vehicles[0]);
    if (screenShakeAmount > 0) {
      shakeCamera(screenShakeAmount);
      screenShakeAmount -= 0.4;
    }
  }
}
function shakeCamera(amt) {
  cameraPos.add(p5.Vector.random2D().mult(amt));
}
function trackVehicleWithCamera(v) {
  const velExtra = v.vel.copy().mult(20);
  cameraPos.x = v.pos.x - width / 2 + velExtra.x;
  cameraPos.y = v.pos.y - height / 2 + velExtra.y;
}

function drawTarget(t) {
  push();

  translateForScreenCoords(t.pos);
  noFill();
  colorMode(HSB, 100);

  stroke(0, 100, 100);
  circle(0, 0, 25);
  drawPetals(4, ix => {
    repeat(3, jx => {
      push();
      translate(jx * 4 + 8, 0);
      line(0, -2 * jx, 0, 2 * jx);
      pop();
    });
  });

  pop();
}
function drawPetals(numPetals, fn) {
  const angle = TWO_PI / numPetals;
  push();
  repeat(numPetals, ix => {
    fn(ix);
    rotate(angle);
  });
  pop();
}
function randInt(min, max) {
  return Math.floor(random(min, max + 1));
}

function atLeastTwoOf(fns) {
  const pickedFns = _.sample(fns, randInt(2, fns.length));
  pickedFns.forEach(f => f());
}

function toggleShowDebug() {
  showDebug = !showDebug;
}