const sectionEl = document.getElementById('closest-color');

const inputElements = sectionEl.querySelectorAll('input[type=file]');
const canvasElements = sectionEl.querySelectorAll('canvas');
const colorCellsContainers = sectionEl.querySelectorAll('.color-cell-container');

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
  stuff.clickEventListener = (event) => onMouseClick(event, stuff);

  stuff.canvasEl.addEventListener('mousemove', stuff.mouseMoveEventListener);
  stuff.canvasEl.addEventListener('mouseleave', stuff.mouseLeaveEventListener);
  stuff.canvasEl.addEventListener('click', stuff.clickEventListener);

  URL.revokeObjectURL(fileObjectUrl);
};

const onMouseClick = (event, stuff) => {
  const { canvasX, canvasY } = getMousePosRelativeToCanvas(stuff.canvasEl, event.clientX, event.clientY);
  pickColor(stuff.canvasEl, stuff.colorCellsContainer, stuff.currentPickerCanvasPosIndex, canvasX, canvasY);

  // Save mouse position
  stuff.pickerCanvasPositions[stuff.currentPickerCanvasPosIndex] = { x: canvasX, y: canvasY };

  // Flip between index 0 and 1
  stuff.currentPickerCanvasPosIndex = stuff.currentPickerCanvasPosIndex === 0 ? 1 : 0;
};

const onMouseMove = (event, stuff) => {
  // Notice flipped 0 and 1 from ususal
  const pickerCanvasPosNotSelecting = stuff.pickerCanvasPositions[stuff.currentPickerCanvasPosIndex === 0 ? 1 : 0];
  const { canvasX, canvasY } = getMousePosRelativeToCanvas(stuff.canvasEl, event.clientX, event.clientY);

  stuff.canvasCtx.clearRect(0, 0, stuff.canvasEl.width, stuff.canvasEl.height);
  drawCanvasImage(stuff);

  // Draw a rect where the mouse is right now
  drawPickerRect(stuff, canvasX, canvasY);
  // Draw the saved rect, from saved pos, that we are not currently using to select a color
  drawPickerRect(stuff, pickerCanvasPosNotSelecting.x, pickerCanvasPosNotSelecting.y);

  pickColor(stuff.canvasEl, stuff.colorCellsContainer, stuff.currentPickerCanvasPosIndex, canvasX, canvasY);
};

const onMouseLeave = (stuff) => {
  stuff.canvasCtx.clearRect(0, 0, stuff.canvasEl.width, stuff.canvasEl.height);

  drawCanvasImage(stuff);
  drawPickerRect(stuff, stuff.pickerCanvasPositions[0].x, stuff.pickerCanvasPositions[0].y);
  drawPickerRect(stuff, stuff.pickerCanvasPositions[1].x, stuff.pickerCanvasPositions[1].y);

  pickColor(
    stuff.canvasEl,
    stuff.colorCellsContainer,
    stuff.currentPickerCanvasPosIndex,
    stuff.pickerCanvasPositions[0].x,
    stuff.pickerCanvasPositions[0].y
  );
  pickColor(
    stuff.canvasEl,
    stuff.colorCellsContainer,
    !stuff.currentPickerCanvasPosIndex,
    stuff.pickerCanvasPositions[1].x,
    stuff.pickerCanvasPositions[1].y
  );
};

const drawPickerRect = (stuff, pickerCanvasX, pickerCanvasY) => {
  const ctx = stuff.canvasCtx;
  ctx.beginPath();
  ctx.rect(pickerCanvasX - 5, pickerCanvasY - 5, 10, 10);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  ctx.stroke();
};

const getMousePosRelativeToCanvas = (canvasEl, mouseX, mouseY) => {
  const bounding = canvasEl.getBoundingClientRect();
  const canvasX = mouseX - bounding.left;
  const canvasY = mouseY - bounding.top;

  return { canvasX, canvasY };
};

/**
 * Sets the canvas as the same size as the image
 *
 * @see https://stackoverflow.com/a/38773017/11763719
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

  /**
   * Need to set both attribute and CSS
   *
   * @see https://medium.com/@banksysan_10088/webgl-canvas-size-confusion-fde3e360f4e9
   */
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
const pickColor = (canvasEl, colorCellsContainer, currentPickerCanvasPosIndex, canvasX, canvasY) => {
  const pixel = canvasEl.getContext('2d').getImageData(canvasX, canvasY, 1, 1);
  const pixelData = pixel.data;

  const rgbColor = `rgb(${pixelData[0]} ${pixelData[1]} ${pixelData[2]} / ${pixelData[3] / 255})`;

  colorCellsContainer.style.setProperty(
    currentPickerCanvasPosIndex === 0 ? '--color-left-cell' : '--color-right-cell',
    rgbColor
  );
};

window.addEventListener('load', () => {
  const defaultStuff = {
    mouseMoveEventListener: undefined,
    mouseLeaveEventListener: undefined,
    clickEventListener: undefined,
    imgObj: undefined,
    currentPickerCanvasPosIndex: 0,
    pickerCanvasPositions: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
  };

  // Left
  inputElements[0].addEventListener('change', (event) =>
    onFileChange(event, {
      ...defaultStuff,
      canvasEl: canvasElements[0],
      canvasCtx: canvasElements[0].getContext('2d'),
      colorCellsContainer: colorCellsContainers[0],
    })
  );

  // Right
  inputElements[1].addEventListener('change', (event) =>
    onFileChange(event, {
      ...defaultStuff,
      canvasEl: canvasElements[1],
      canvasCtx: canvasElements[1].getContext('2d'),
      colorCellsContainer: colorCellsContainers[1],
    })
  );
});
