let canvas;
let ctx;
let appWidth;
let appHeight;
const DIRECTIONS = {
  ArrowRight: "RIGHT",
  ArrowLeft: "LEFT",
  ArrowUp: "UP",
  ArrowDown: "DOWN"
};
let direction = DIRECTIONS.ArrowRight;
let pointSize = 5;
let currX;
let currY;

// called by NOOPBOT on window.onload
function start_app() {
  // size canvas to window
  sizeCanvas();

  // set initial x & y
  currX = Math.ceil(appWidth / 10);
  currY = Math.ceil(appHeight / 10);

  //set up a ticker to refresh page automatically.
  let speed = 50; // how often screen refreshes, in milliseconds.

  let ticker = NOOPBOT_TICK_SETUP(advanceAndDraw, speed);
  window.onkeyup = ({ key }) => {
    direction = DIRECTIONS[key];
  };
}

function sizeCanvas() {
  appWidth = window.innerWidth;
  appHeight = window.innerHeight;
  canvas = document.getElementById("canvas");
  ctx = NOOPBOT_SETUP_CANVAS({ canvas: canvas, bgColor: "#ffffff" });
}

function popAndDraw() {
  if (queuedPoints.length) {
    const point = queuedPoints.pop();
    queuedPoints = []; //clear
    draw(point);
  }
}

function advanceAndDraw() {
  if (direction === DIRECTIONS.ArrowRight && currX + pointSize < appWidth) {
    currX += pointSize;
  } else if (direction === DIRECTIONS.ArrowLeft && currX - pointSize > 0) {
    currX -= pointSize;
  } else if (
    direction === DIRECTIONS.ArrowDown &&
    currY + pointSize < appHeight
  ) {
    currY += pointSize;
  } else if (direction === DIRECTIONS.ArrowUp && currY - pointSize > 0) {
    currY -= pointSize;
  }
  draw({ x: currX, y: currY });
}

function draw({ x, y }) {
  //get the data!
  NOOPBOT_FETCH(
    {
      API: "hexbot"
    },
    ({ colors: [{ value }] }) => {
      ctx.fillStyle = value;
      //   ctx.globalAlpha = Math.random();
      ctx.beginPath();
      ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
      ctx.fill();
    }
  );
}

// listen if browser changes size.
window.onresize = function(event) {
  sizeCanvas();
  draw();
};
