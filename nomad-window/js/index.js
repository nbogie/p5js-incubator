let myCanvas;

function setup() {
  //use a variable to store a pointer to the canvas
  myCanvas = createCanvas(300, 300);
  const body = document.getElementsByTagName('body')[0];
  myCanvas.parent(body);
  myCanvas.style('z-index', '-1');
}

function draw() {
  background('orange');
  fill(100);
  noStroke();

  //move the canvas to the horizontal mouse position
  //relative to the window
  let x = windowWidth * noise(frameCount/400);
  let y = winMouseY;
  myCanvas.position(x, y);

  if (mouseX < 10 || mouseX > width - 10){
    fill('red')
  }

  rectMode(CENTER);
    //the y of the square is relative to the canvas
  rect(mouseX, height/2, 60, 60);
}