//See documentation at https://p5js.org/reference/#/p5.FFT/getEnergy

//This will represent an FFT audio-analysis algorithm
//which can supply information about the strength of different frequencies within a sound
let fft;

var video;
let effect;
let startedAudio;

function mousePressed() {
  //chrome doesn't let audio start without gestures
  getAudioContext().resume();
  startedAudio = true;
}

function setup() {
  //video capture ---> Seriously.js "tvglitch" effect ---> canvas
  //                                    ^
  //                                    |
  //                                    |
  //audio lvl mods distortion param ____|

  canvas = createCanvas(640, 480, WEBGL);
  canvas.id("p5canvas");

  video = createCapture(VIDEO);
  video.size(width, height);
  video.id("p5video");
  video.hide();

  let mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);

  var seriously = new Seriously();

  var src = seriously.source("#p5video");
  var target = seriously.target("#p5canvas");

  effect = seriously.effect("tvglitch");
  effect.distortion = 0;
  effect.lineSync = 0;

  effect.source = src;
  target.source = effect;

  seriously.go();
}

function draw() {
  //Each frame, modify the distortion parameter of the glitch effect, according to the bass energy from the audio fft
  if (startedAudio) {
    //Note: You must call fft.analyze() before calling fft.getEnergy()
    fft.analyze();
    //Note: fft.getEnergy() returns 0 to 255
    const energy = fft.getEnergy("bass");
    effect.distortion = constrain(map(energy, 0, 255, -2, 1), 0, 1);
  } else {
    //show a cue to click screen, if user hasn't interacted yet
    fill("blue");
    circle(0, 0, 100);
    fill("red");
    circle(0, 0, 50);
  }
}
