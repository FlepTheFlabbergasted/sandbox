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

  imgObj.addEventListener('load', () => {
    setCanvasSizeToImgSize(stuff.canvasEl, imgObj);
    drawCanvasImage(stuff.canvasEl, stuff.canvasCtx, imgObj);

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
  });

  imgObj.src = fileObjectUrl;
  stuff.imgObj = imgObj;
};

const onMouseClick = (event, stuff) => {
  const { canvasX, canvasY } = getMousePosRelativeToCanvas(stuff.canvasEl, event.clientX, event.clientY);
  setColorCellsContainerColorProperty(
    stuff.colorCellsContainer,
    stuff.currentPickerCanvasPosIndex,
    getCanvasPixelColor(stuff.canvasCtx, canvasX, canvasY)
  );

  // Save mouse position
  stuff.pickerCanvasPositions[stuff.currentPickerCanvasPosIndex] = { x: canvasX, y: canvasY };

  // Flip between index 0 and 1
  stuff.currentPickerCanvasPosIndex = stuff.currentPickerCanvasPosIndex === 0 ? 1 : 0;
};

const onMouseMove = (event, stuff) => {
  // Notice flipped logic for 0 and 1 from ususal
  const pickerCanvasPosNotSelecting = stuff.pickerCanvasPositions[stuff.currentPickerCanvasPosIndex === 0 ? 1 : 0];
  const { canvasX, canvasY } = getMousePosRelativeToCanvas(stuff.canvasEl, event.clientX, event.clientY);

  stuff.canvasCtx.clearRect(0, 0, stuff.canvasEl.width, stuff.canvasEl.height);
  drawCanvasImage(stuff.canvasEl, stuff.canvasCtx, stuff.imgObj);

  // Draw a rect where the mouse is right now
  drawPickerRect(stuff.canvasCtx, canvasX, canvasY);
  // Draw the saved rect, from saved pos, that we are not currently using to select a color
  drawPickerRect(stuff.canvasCtx, pickerCanvasPosNotSelecting.x, pickerCanvasPosNotSelecting.y);

  setColorCellsContainerColorProperty(
    stuff.colorCellsContainer,
    stuff.currentPickerCanvasPosIndex,
    getCanvasPixelColor(stuff.canvasCtx, canvasX, canvasY)
  );
};

const onMouseLeave = (stuff) => {
  stuff.canvasCtx.clearRect(0, 0, stuff.canvasEl.width, stuff.canvasEl.height);

  drawCanvasImage(stuff.canvasEl, stuff.canvasCtx, stuff.imgObj);
  drawPickerRect(stuff.canvasCtx, stuff.pickerCanvasPositions[0].x, stuff.pickerCanvasPositions[0].y);
  drawPickerRect(stuff.canvasCtx, stuff.pickerCanvasPositions[1].x, stuff.pickerCanvasPositions[1].y);

  setColorCellsContainerColorProperty(
    stuff.colorCellsContainer,
    0,
    getCanvasPixelColor(stuff.canvasCtx, stuff.pickerCanvasPositions[0].x, stuff.pickerCanvasPositions[0].y)
  );
  setColorCellsContainerColorProperty(
    stuff.colorCellsContainer,
    1,
    getCanvasPixelColor(stuff.canvasCtx, stuff.pickerCanvasPositions[1].x, stuff.pickerCanvasPositions[1].y)
  );
};

const drawPickerRect = (canvasCtx, pickerCanvasX, pickerCanvasY) => {
  canvasCtx.beginPath();
  canvasCtx.rect(pickerCanvasX - 5, pickerCanvasY - 5, 10, 10);
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'white';
  canvasCtx.stroke();
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
const setCanvasSizeToImgSize = (canvasEl, imgObj) => {
  let imgNatWidth = imgObj.naturalWidth;
  let imgNatHeight = imgObj.naturalHeight;
  let scaleX = 1;
  let scaleY = 1;
  let scaledCanvasAndImgWidth = 0;
  let scaledCanvasAndImgHeight = 0;

  if (imgNatWidth > canvasEl.clientWidth) {
    scaleX = canvasEl.clientWidth / imgNatWidth;
  }

  if (imgNatHeight > canvasEl.height) {
    scaleY = canvasEl.height / imgNatHeight;
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
  canvasEl.width = scaledCanvasAndImgWidth;
  canvasEl.style.width = `${scaledCanvasAndImgWidth}px`;
  canvasEl.height = scaledCanvasAndImgHeight;
  canvasEl.style.height = `${scaledCanvasAndImgHeight}px`;
};

const drawCanvasImage = (canvasEl, canvasCtx, imgObj) => {
  canvasCtx.drawImage(imgObj, 0, 0, imgObj.naturalWidth, imgObj.naturalHeight, 0, 0, canvasEl.width, canvasEl.height);
};

// Code from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#creating_a_color_picker
const getCanvasPixelColor = (canvasCtx, canvasX, canvasY) => {
  const pixel = canvasCtx.getImageData(canvasX, canvasY, 1, 1);
  const pixelData = pixel.data;

  const rgbColorStr = `rgb(${pixelData[0]} ${pixelData[1]} ${pixelData[2]} / ${pixelData[3] / 255})`;

  return rgbColorStr;
};

const setColorCellsContainerColorProperty = (colorCellsContainer, currentPickerCanvasPosIndex, rgbColorStr) => {
  colorCellsContainer.style.setProperty(
    currentPickerCanvasPosIndex === 0 ? '--color-left-cell' : '--color-right-cell',
    rgbColorStr
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
