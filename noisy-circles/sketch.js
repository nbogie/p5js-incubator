//TODO: add this as a brush to a design system
// to make variations on hand-drawn flowers
let circles;

let palette = ["#404040", "#d1f2a5", "#f56991", "#effab4", "#ffffff"];

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	colorMode(HSB, 360, 100, 100);
	restart();
	noLoop();
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

function drawCircle({
	cX,
	cY,
	amp,
	colr,
	phase
}) {
	noStroke();
	fill(colr);
	push();
	translate(cX, cY);
	let angleStep = TWO_PI / 128;
	beginShape();
	for (let angle = 0; angle < TWO_PI; angle += angleStep) {
		let xNormal = cos(angle);
		let yNormal = sin(angle);
		let noise = map(
			loopedNoise(angle, phase),
			0,
			1,
			0.8,
			1.1
		);
		let x = xNormal * noise * amp;
		let y = yNormal * noise * amp;
		vertex(x, y);
	}
	endShape(CLOSE);
	pop();
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