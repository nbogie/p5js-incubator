"use strict";

class Sun {
  constructor() {
    this.pos = { x: width / 5, y: height / 8 };
    this.vel = { x: 0, y: 0 };
    this.radius = 100;
  }

  draw = () => {
    push();
    translate(this.pos.x, this.pos.y);
    fill("gold");
    circle(0, 0, this.radius);
    fill("yellow");
    circle(0, 0, this.radius / 2);
    push();
    rotate(this.rotation1);
    this.drawRaySet("yellow");
    rotate(PI / 4);
    this.drawRaySet("yellow");
    pop();

    rotate(this.rotation2);
    this.drawRaySet("yellow");
    rotate(PI / 4);
    this.drawRaySet("yellow");
    pop();
  };

  drawRaySet = c => {
    stroke(c);
    strokeWeight(20);
    line(0, 0, 2000, 0);
    line(0, 0, -2000, 0);
    line(0, 0, 0, 2000);
    line(0, 0, 0, -2000);
  };
  update = () => {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.rotation1 = frameCount / 100;
    this.rotation2 = -frameCount / 39;
  };
  mousePressed = () => {};
}
class Rainbow {
  constructor() {
    this.pos = { x: width / 2, y: height / 2 };
    this.stripeWidth = 40;
  }

  draw = () => {
    push();
    translate(this.pos.x, this.pos.y);
    const stripeWidth = this.stripeWidth;
    const colors = "red orange yellow green blue indigo violet white".split(
      " "
    );
    colors.forEach((c, i) => {
      fill(c);
      arc(0, 0, 400 - i * stripeWidth, 400 - i * stripeWidth, PI, 0);
    });
    pop();
  };

  update = () => {
    this.stripeWidth = map(sin(frameCount / 20), -1, 1, 20, 60);
  };
  mousePressed = () => {};
}

class Flood {
  constructor() {
    this.pos = { x: width / 2, y: height / 2 };
    this.waves = [];
    repeat(100, ix => {
      this.waves.push({
        pos: {
          x: random(width),
          y: random(-5, 5) + map(ix, 0, 100, height * 0.7, height + 50)
        },
        w: 400,
        h: 300,
        phase: random(TWO_PI),
        color: random("cadetblue skyblue powderblue".split(" "))
      });
    });
  }

  draw = () => {
    push();

    const stripeWidth = 70;
    const colors = colorMode(RGB);

    this.waves.forEach(wave => {
      fill(wave.color);
      push();
      translate(-50 + wave.pos.x, wave.pos.y);
      arc(0, 0, wave.w - stripeWidth, wave.h - stripeWidth, 1.5 * PI, 0);
      rectMode(CENTER);
      rect(0, 0, width, 50);
      pop();
    });
  };

  update = () => {
    this.waves.forEach(wave => {
      wave.pos.x += map(sin(wave.phase + frameCount / 40), -1, 1, -0.4, 0.4);
    });
  };

  mousePressed = () => {};
}

class Tank {
  constructor() {
    this.pos = randomScreenPos();
    this.vel = { x: 0, y: 0 };
    this.size = random([1, 2, 3, 4]);
  }
  draw = () => {
    fill("dodgerblue");
    square(this.pos.x, this.pos.y, 100);
  };
  update = () => {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  };
  mousePressed = () => {
    this.vel.x = map(mouseX, 0, width, -3, 3);
    this.vel.y = map(mouseY, 0, height, -3, 3);
  };
}

class RainSystem {
  raindrops;
  constructor(isSnow) {
    this.isSnow = isSnow;
    this.raindrops = [];
    this.mainColor = isSnow ? "whitesmoke" : 155;
    for (let i = 0; i < 100; i++) {
      this.raindrops.push(this.makeRaindrop());
    }
  }
  draw = () => {
    fill(this.mainColor);
    noStroke();
    this.raindrops.forEach(r => circle(r.pos.x, r.pos.y, r.size));
  };
  update = () => {
    this.raindrops.forEach(r => this.updateRaindrop(r));
  };
  makeRaindrop = () => {
    return {
      pos: randomScreenPos(),
      vel: { x: random(3, 3.5), y: random(2.8, 3) },
      size: random([1, 2, 3, 4])
    };
  };
  updateRaindrop = r => {
    r.pos.x += r.vel.x;
    r.pos.y += r.vel.y;
    r.pos.x = r.pos.x < 0 ? width + r.pos.x : r.pos.x;
    r.pos.y = r.pos.y < 0 ? height + r.pos.y : r.pos.y;
    r.pos.x = r.pos.x > width ? r.pos.x - width : r.pos.x;
    r.pos.y = r.pos.y > height ? r.pos.y - height : r.pos.y;
    if (this.isSnow) {
      r.vel.x += map(noise(frameCount / 10), 0, 1, -0.2, 0.2);

      r.vel.x = r.vel.x > 1 ? 1 : r.vel.x;
      r.vel.x = r.vel.x < -1 ? -1 : r.vel.x;
    }
  };
  mousePressed = () => {};
}

class Clouds {
  clouds;
  constructor() {
    this.clouds = [];
    for (let i = 0; i < 6; i++) {
      this.clouds.push(this.makeCloud());
    }
  }

  makeCloud = () => {
    const blobs = [];
    repeat(5, () => {
      blobs.push({
        pos: {
          x: random(-50, 50),
          y: random(-30, 30)
        },
        size: random(40, 80)
      });
    });
    return { pos: randomScreenPos(), blobs: blobs };
  };

  drawCloud = c => {
    this.drawCloudInner(c, 10, "whitesmoke");
    this.drawCloudInner(c, 0, "gray");
  };

  drawCloudInner = (c, szBoost, color) => {
    fill(color);
    noStroke();
    push();
    translate(c.pos.x, c.pos.y);
    c.blobs.forEach(b => {
      push();
      translate(b.pos.x, b.pos.y);
      circle(0, 0, b.size + szBoost);
      pop();
    });
    pop();
  };

  updateCloud = c => {
    c.pos.x += 4;
    if (c.pos.x > width) {
      c.pos.x -= width;
    }
  };

  draw = () => {
    this.clouds.forEach(this.drawCloud);
  };

  update = () => {
    this.clouds.forEach(this.updateCloud);
  };

  mousePressed = () => {};
}

function draw() {
  background(200);
  actors.forEach(a => a.draw());
  actors.forEach(a => a.update());
}
const actors = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  actors.push(new Tank());
  actors.push(new Sun());
  actors.push(new Clouds());
  actors.push(new RainSystem(false));
  actors.push(new RainSystem(true));
  actors.push(new Rainbow());
  actors.push(new Flood());

  //  noLoop();
}

function randomScreenPos() {
  return { x: random(width), y: random(height) };
}

function repeat(n, fn) {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}
function mousePressed() {
  actors.forEach(a => {
    a.mousePressed();
  });
}
