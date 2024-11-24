const sectionEl = document.getElementById('retrofuturism');
const scanContainer = sectionEl.querySelector('#scan-container');
const scanCanvas = sectionEl.querySelector('#scan-canvas');

const drawStuff = (canvas) => {
  const ctx = canvas.getContext('2d');
  const startingHeight = (canvas.height / 3) * 2;
  const lineLength = 20;
  const canvasDrawingPadding = canvas.height / 5;

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(199, 163, 20, 0.4)'; // --primary-rgb + opacity change

  // Middle Line
  ctx.beginPath();
  ctx.moveTo(0, startingHeight);
  ctx.lineTo(canvas.width / 2, startingHeight);
  ctx.stroke();

  let lastXPos = canvas.width / 2;
  let lastYPos = startingHeight;

  for (let i = 0; i <= 10; i++) {
    // Up : Down
    const degree = i % 2 === 0 ? -45 : 45;
    const minLineLength = lineLength;
    const maxLineLength = 0 + canvasDrawingPadding;

    // Position ourselves at the end of the last line, rotate canvas and draw a "straight" line
    ctx.translate(lastXPos, lastYPos);
    ctx.rotate(degToRad(degree));
    ctx.lineTo(lineLength, 0);
    ctx.stroke();
    ctx.resetTransform();

    lastXPos = Math.round(Math.cos(degree) * lineLength + lastXPos);
    lastYPos = Math.round(Math.sin(degree) * lineLength + lastYPos);
  }
};

const setCanvasSize = (canvas) => {
  const parentRect = canvas.parentElement.getBoundingClientRect();
  scanCanvas.width = Math.ceil(parentRect.width);
  scanCanvas.height = Math.ceil(parentRect.height);
};

const degToRad = (degree) => (degree * Math.PI) / 180;

window.addEventListener('load', () => {
  setCanvasSize(scanCanvas);
  drawStuff(scanCanvas);
});
window.addEventListener('resize', () => setCanvasSize(scanCanvas));
