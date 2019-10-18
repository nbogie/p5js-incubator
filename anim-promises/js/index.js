"use strict";

class Bug {
  pos;
  destination;
  tolerance;

  myTimer;
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.destination = undefined;
    this.tolerance = 30;
  }
  show() {
    noFill();
    this.destination ? stroke("white") : stroke("red");
    strokeWeight(2);
    rectMode(CENTER);
    square(this.pos.x, this.pos.y, 10);
    noStroke();
    fill("white");
    text(vecToNeatString(this.pos), this.pos.x + 15, this.pos.y + 15);
    text("dest: " + vecToNeatString(this.destination), 100, 100);

    if (this.destination) {
      stroke("green");
      noFill();
      circle(this.destination.x, this.destination.y, this.tolerance * 2);
    }
  }

  nearDestination() {
    return this.destination.dist(this.pos) < this.tolerance;
  }
  update() {
    if (this.destination) {
      const delta = this.destination.copy().sub(this.pos);
      this.pos.add(delta.mult(0.05));
    }
  }

  goToDestination(x, y) {
    const bugThis = this;
    return new Promise((resolve, reject) => {
      function checker() {
        if (bugThis.nearDestination()) {
          console.log(
            "reached destination.  clearing interval.  resolving promise."
          );
          bugThis.destination = undefined;
          clearInterval(bugThis.myTimer);
          bugThis.myTimer = undefined;
          resolve(bugThis);
        }
      }
      if (this.myTimer) {
        console.log(
          "a timer is still running.  i'm not going to start again, though that might be a good plan."
        );
        return new Promise((resolve, reject) => {
          reject("a timer is still running.");
        });
      } else {
        this.destination = createVector(x, y);
        this.myTimer = setInterval(checker, 50);
      }
    });
  }
}
let gBug;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  gBug = new Bug();
}

function draw() {
  background(100);

  gBug.update();
  gBug.show();
}

function keyPressed() {
  if (key == "a") {
    gBug
      .goToDestination(30, height / 2)
      .then(b => b.goToDestination(width - 30, height / 2))
      .catch(e => console.log("error: ", e));
  }
}

function vecToNeatString(v) {
  return v ? `(${round(v.x)},${round(v.y)})` : "undefined";
}
