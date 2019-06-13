let canvas;
let ctx;
let appWidth;
let appHeight;
let queuedPoints = [];

// called by NOOPBOT on window.onload
function start_app() {
  // size canvas to window
  sizeCanvas();

  // set initial x & y
  currX = Math.ceil(appWidth / 10);
  currY = Math.ceil(appHeight / 10);

  //set up a ticker to refresh page automatically.
  let speed = 50; // how often screen refreshes, in milliseconds.

  let ticker = NOOPBOT_TICK_SETUP(popAndDraw, speed);
  canvas.addEventListener("mousemove", ({ x, y }) =>
    queuedPoints.push({ x, y })
  );
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

function draw({ x, y }) {
  //get the data!
  NOOPBOT_FETCH(
    {
      API: "hexbot"
    },
    ({ colors: [{ value }] }) => {
      ctx.fillStyle = value;
      let pointSize = 2;
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
