const sectionEl = document.getElementById('closest-color');

const inputElements = sectionEl.querySelectorAll('input[type=file]');
const inputElLeft = inputElements[0];
const inputElRight = inputElements[1];

const canvasElements = sectionEl.querySelectorAll('canvas');
const canvasElLeft = canvasElements[0];
const canvasElRight = canvasElements[1];

const colorCellContainers = sectionEl.querySelectorAll('.color-cell-container');
const colorCellContainerLeft = colorCellContainers[0];
const colorCellContainerRight = colorCellContainers[1];

const stuffLeft = {
  canvasEl: canvasElLeft,
  canvasCtx: canvasElLeft.getContext('2d'),
  colorCellContainer: colorCellContainerLeft,
  shouldSetLeftColor: true,
  mouseMoveEventListener: undefined,
  mouseLeaveEventListener: undefined,
  clickEventListener: undefined,
  imgObj: undefined,
  pickerX: 0,
  pickerY: 0,
};

const stuffRight = {
  canvasEl: canvasElRight,
  canvasCtx: canvasElRight.getContext('2d'),
  colorCellContainer: colorCellContainerRight,
  shouldSetLeftColor: true,
  mouseMoveEventListener: undefined,
  mouseLeaveEventListener: undefined,
  clickEventListener: undefined,
  imgObj: undefined,
  pickerX: 0,
  pickerY: 0,
};

const onFileChange = (event, stuff) => {
  if (event.target.files.length !== 1) {
    return;
  }

  const file = event.target.files[0];
  const fileObjectUrl = URL.createObjectURL(file);
  const imgObj = new Image();

  imgObj.addEventListener('load', () => onImageObjHasLoaded(stuff, fileObjectUrl));

  imgObj.src = fileObjectUrl;
  stuff.imgObj = imgObj;
};

const onImageObjHasLoaded = (stuff, fileObjectUrl) => {
  setCanvasSizeToImgSize(stuff);
  drawCanvasImage(stuff);

  stuff.canvasEl.removeEventListener('mousemove', stuff.mouseMoveEventListener);
  stuff.canvasEl.removeEventListener('mouseleave', stuff.mouseLeaveEventListener);
  stuff.canvasEl.removeEventListener('click', stuff.clickEventListener);

  stuff.mouseMoveEventListener = (event) => onMouseMove(event, stuff);
  stuff.mouseLeaveEventListener = () => onMouseLeave(stuff);
  stuff.clickEventListener = () => onMouseClick(stuff);

  stuff.canvasEl.addEventListener('mousemove', stuff.mouseMoveEventListener);
  stuff.canvasEl.addEventListener('mouseleave', stuff.mouseLeaveEventListener);
  stuff.canvasEl.addEventListener('click', stuff.clickEventListener);

  URL.revokeObjectURL(fileObjectUrl);
};

const onMouseClick = (stuff) => {
  pickColor(stuff, stuff.selectedColorCell);
  stuff.shouldSetLeftColor = !stuff.shouldSetLeftColor;
};

const onMouseMove = (event, stuff) => {
  stuff.pickerX = event.clientX;
  stuff.pickerY = event.clientY;

  stuff.canvasCtx.clearRect(0, 0, stuff.canvasEl.width, stuff.canvasEl.height);
  drawCanvasImage(stuff);
  drawPickerRect(stuff);
  pickColor(stuff);
};

const onMouseLeave = (stuff) => {
  stuff.canvasCtx.clearRect(0, 0, stuff.canvasEl.width, stuff.canvasEl.height);
  drawCanvasImage(stuff);
};

const drawPickerRect = (stuff) => {
  const bounding = stuff.canvasEl.getBoundingClientRect();
  const x = stuff.pickerX - bounding.left;
  const y = stuff.pickerY - bounding.top;

  const ctx = stuff.canvasCtx;

  ctx.beginPath();
  ctx.rect(x - 5, y - 5, 10, 10);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  ctx.stroke();
};

/**
 * Code from https://stackoverflow.com/a/38773017/11763719
 *
 * Sets the canvas as the same size as the image
 */
const setCanvasSizeToImgSize = (stuff) => {
  let imgNatWidth = stuff.imgObj.naturalWidth;
  let imgNatHeight = stuff.imgObj.naturalHeight;
  let scaleX = 1;
  let scaleY = 1;
  let scaledCanvasAndImgWidth = 0;
  let scaledCanvasAndImgHeight = 0;

  if (imgNatWidth > stuff.canvasEl.clientWidth) {
    scaleX = stuff.canvasEl.clientWidth / imgNatWidth;
  }

  if (imgNatHeight > stuff.canvasEl.height) {
    scaleY = stuff.canvasEl.height / imgNatHeight;
  }

  let scale = scaleY;
  if (scaleX < scaleY) {
    scale = scaleX;
  }

  if (scale < 1) {
    // Gotta ceil so no fractions are present since repeated calls will decrease the values
    scaledCanvasAndImgWidth = Math.ceil(imgNatWidth * scale);
    scaledCanvasAndImgHeight = Math.ceil(imgNatHeight * scale);
  }

  // See https://medium.com/@banksysan_10088/webgl-canvas-size-confusion-fde3e360f4e9
  stuff.canvasEl.width = scaledCanvasAndImgWidth;
  stuff.canvasEl.style.width = `${scaledCanvasAndImgWidth}px`;
  stuff.canvasEl.height = scaledCanvasAndImgHeight;
  stuff.canvasEl.style.height = `${scaledCanvasAndImgHeight}px`;
};

const drawCanvasImage = (stuff) => {
  stuff.canvasCtx.drawImage(
    stuff.imgObj,
    0,
    0,
    stuff.imgObj.naturalWidth,
    stuff.imgObj.naturalHeight,
    0,
    0,
    stuff.canvasEl.width,
    stuff.canvasEl.height
  );
};

// Code from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#creating_a_color_picker
const pickColor = (stuff) => {
  const bounding = stuff.canvasEl.getBoundingClientRect();
  const x = stuff.pickerX - bounding.left;
  const y = stuff.pickerY - bounding.top;
  const pixel = stuff.canvasCtx.getImageData(x, y, 1, 1);
  const pixelData = pixel.data;

  const rgbColor = `rgb(${pixelData[0]} ${pixelData[1]} ${pixelData[2]} / ${pixelData[3] / 255})`;

  stuff.colorCellContainer.style.setProperty(
    stuff.shouldSetLeftColor ? '--color-left-cell' : '--color-right-cell',
    rgbColor
  );
};

window.addEventListener('load', () => {
  inputElLeft.addEventListener('change', (event) => onFileChange(event, stuffLeft));
  inputElRight.addEventListener('change', (event) => onFileChange(event, stuffRight));
});
