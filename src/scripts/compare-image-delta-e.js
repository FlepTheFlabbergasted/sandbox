import rgbToLab from '@fantasy-color/rgb-to-lab';
import DeltaE from 'delta-e';

const sectionEl = document.getElementById('compare-image-delta-e');

const INITIAL_CANVAS_WIDTH_PX = 600;
const INITIAL_CANVAS_HEIGHT_PX = 370;

const inputElements = sectionEl.querySelectorAll('input[type=file]');
const canvasElements = sectionEl.querySelectorAll('canvas');
const colorCellsContainers = sectionEl.querySelectorAll('.color-cell-container');
const deltaESpans = sectionEl.querySelectorAll('.delta-e');

const onFileChange = (event, stuff) => {
  if (event.target.files.length !== 1) {
    return;
  }

  // Reset current picker index
  stuff.currentPickerCanvasPosIndex = 0;
  // Reset picker positions and rgb numbers for new images
  stuff.pickerCanvasPositions = [
    { x: undefined, y: undefined },
    { x: undefined, y: undefined },
  ];
  stuff.rgbs = [
    { red: 0, green: 0, blue: 0 },
    { red: 0, green: 0, blue: 0 },
  ];

  // Reset cell colors
  resetColorsCellsContainerColorProperty(stuff.colorCellsContainer, 0);
  resetColorsCellsContainerColorProperty(stuff.colorCellsContainer, 1);
  // Reset canvas size
  setCanvasSize(stuff.canvasEl, INITIAL_CANVAS_WIDTH_PX, INITIAL_CANVAS_HEIGHT_PX);
  // Remove previous delta value
  resetColorDelta(stuff.deltaESpan);

  const file = event.target.files[0];
  const fileObjectUrl = URL.createObjectURL(file);
  const imgObj = new Image();

  imgObj.addEventListener('load', () => {
    setCanvasSizeToImgSize(stuff.canvasEl, imgObj);
    drawCanvasImage(stuff.canvasEl, stuff.canvasCtx, imgObj);
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
    getCanvasPixelRgbStr(stuff.canvasCtx, canvasX, canvasY)
  );

  // Save mouse position
  stuff.pickerCanvasPositions[stuff.currentPickerCanvasPosIndex] = { x: canvasX, y: canvasY };

  // Save rgb for this index
  stuff.rgbs[stuff.currentPickerCanvasPosIndex] = getCanvasPixelRgb(stuff.canvasCtx, canvasX, canvasY);

  // Flip between index 0 and 1
  stuff.currentPickerCanvasPosIndex = stuff.currentPickerCanvasPosIndex === 0 ? 1 : 0;

  // If both colors are set, display the diff
  if (stuff.rgbs[0]?.red && stuff.rgbs[1]?.red) {
    displayColorDelta(stuff.deltaESpan, stuff.rgbs[0], stuff.rgbs[1]);
  }
};

const displayColorDelta = (deltaESpan, rgb1, rgb2) => {
  const lab1 = rgbToLab({ ...rgb1 });
  const lab2 = rgbToLab({ ...rgb2 });

  const colorDiff = DeltaE.getDeltaE00(
    { L: lab1.luminance, A: lab1.a, B: lab1.b },
    { L: lab2.luminance, A: lab2.a, B: lab2.b }
  ).toFixed(1);

  deltaESpan.textContent = colorDiff;
};

const resetColorDelta = (deltaESpan) => {
  deltaESpan.textContent = 0.0;
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
  if (pickerCanvasPosNotSelecting.x !== undefined && pickerCanvasPosNotSelecting.y !== undefined) {
    drawPickerRect(stuff.canvasCtx, pickerCanvasPosNotSelecting.x, pickerCanvasPosNotSelecting.y);
  }

  setColorCellsContainerColorProperty(
    stuff.colorCellsContainer,
    stuff.currentPickerCanvasPosIndex,
    getCanvasPixelRgbStr(stuff.canvasCtx, canvasX, canvasY)
  );
};

const onMouseLeave = (stuff) => {
  stuff.canvasCtx.clearRect(0, 0, stuff.canvasEl.width, stuff.canvasEl.height);
  drawCanvasImage(stuff.canvasEl, stuff.canvasCtx, stuff.imgObj);

  if (stuff.pickerCanvasPositions[0].x !== undefined && stuff.pickerCanvasPositions[0].y !== undefined) {
    drawPickerRect(stuff.canvasCtx, stuff.pickerCanvasPositions[0].x, stuff.pickerCanvasPositions[0].y);
    setColorCellsContainerColorProperty(
      stuff.colorCellsContainer,
      0,
      getCanvasPixelRgbStr(stuff.canvasCtx, stuff.pickerCanvasPositions[0].x, stuff.pickerCanvasPositions[0].y)
    );
  } else {
    resetColorsCellsContainerColorProperty(stuff.colorCellsContainer, 0);
  }

  if (stuff.pickerCanvasPositions[1].x !== undefined && stuff.pickerCanvasPositions[1].y !== undefined) {
    drawPickerRect(stuff.canvasCtx, stuff.pickerCanvasPositions[1].x, stuff.pickerCanvasPositions[1].y);
    setColorCellsContainerColorProperty(
      stuff.colorCellsContainer,
      1,
      getCanvasPixelRgbStr(stuff.canvasCtx, stuff.pickerCanvasPositions[1].x, stuff.pickerCanvasPositions[1].y)
    );
  } else {
    resetColorsCellsContainerColorProperty(stuff.colorCellsContainer, 1);
  }
};

const drawPickerRect = (canvasCtx, pickerCanvasX, pickerCanvasY) => {
  canvasCtx.beginPath();
  canvasCtx.rect(pickerCanvasX - 7, pickerCanvasY - 7, 14, 14);
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

  setCanvasSize(canvasEl, scaledCanvasAndImgWidth, scaledCanvasAndImgHeight);
};

/**
 * Need to set both attribute and CSS
 *
 * @see https://medium.com/@banksysan_10088/webgl-canvas-size-confusion-fde3e360f4e9
 */
const setCanvasSize = (canvasEl, width, height) => {
  canvasEl.width = width;
  canvasEl.style.width = `${width}px`;
  canvasEl.height = height;
  canvasEl.style.height = `${height}px`;
};

const drawCanvasImage = (canvasEl, canvasCtx, imgObj) => {
  canvasCtx.drawImage(imgObj, 0, 0, imgObj.naturalWidth, imgObj.naturalHeight, 0, 0, canvasEl.width, canvasEl.height);
};

// Code from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#creating_a_color_picker
const getCanvasPixelRgbStr = (canvasCtx, canvasX, canvasY) => {
  const { red, green, blue } = getCanvasPixelRgb(canvasCtx, canvasX, canvasY);
  return `rgb(${red}, ${green}, ${blue})`;
};

const getCanvasPixelRgb = (canvasCtx, canvasX, canvasY) => {
  const pixel = canvasCtx.getImageData(canvasX, canvasY, 1, 1);
  const pixelData = pixel.data;

  // const rgbColorStr = `rgb(${pixelData[0]} ${pixelData[1]} ${pixelData[2]} / ${pixelData[3] / 255})`;

  return { red: pixelData[0], green: pixelData[1], blue: pixelData[2] };
};

const setColorCellsContainerColorProperty = (colorCellsContainer, pickerCanvasPosIndex, rgbColorStr) => {
  colorCellsContainer.style.setProperty(
    pickerCanvasPosIndex === 0 ? '--color-left-cell' : '--color-right-cell',
    rgbColorStr
  );
};

const resetColorsCellsContainerColorProperty = (colorCellsContainer, pickerCanvasPosIndex) => {
  colorCellsContainer.style.removeProperty(pickerCanvasPosIndex === 0 ? '--color-left-cell' : '--color-right-cell');
};

const registerMouseAndClickEventListeners = (stuff) => {
  stuff.canvasEl.addEventListener('mousemove', (event) => {
    if (stuff.imgObj) {
      onMouseMove(event, stuff);
    }
  });
  stuff.canvasEl.addEventListener('mouseleave', () => {
    if (stuff.imgObj) {
      onMouseLeave(stuff);
    }
  });
  stuff.canvasEl.addEventListener('click', (event) => {
    if (stuff.imgObj) {
      onMouseClick(event, stuff);
    }
  });
};

window.addEventListener('load', () => {
  canvasElements.forEach((canvasEl) => setCanvasSize(canvasEl, INITIAL_CANVAS_WIDTH_PX, INITIAL_CANVAS_HEIGHT_PX));

  const defaultStuff = {
    imgObj: undefined,
    currentPickerCanvasPosIndex: 0,
    pickerCanvasPositions: [
      { x: undefined, y: undefined },
      { x: undefined, y: undefined },
    ],
    rgbs: [
      { red: 0, green: 0, blue: 0 },
      { red: 0, green: 0, blue: 0 },
    ],
  };

  const leftStuff = {
    ...defaultStuff,
    canvasEl: canvasElements[0],
    canvasCtx: canvasElements[0].getContext('2d'),
    colorCellsContainer: colorCellsContainers[0],
    deltaESpan: deltaESpans[0],
  };
  const rightStuff = {
    ...defaultStuff,
    canvasEl: canvasElements[1],
    canvasCtx: canvasElements[1].getContext('2d'),
    colorCellsContainer: colorCellsContainers[1],
    deltaESpan: deltaESpans[1],
  };

  registerMouseAndClickEventListeners(leftStuff);
  registerMouseAndClickEventListeners(rightStuff);

  inputElements[0].addEventListener('change', (event) => onFileChange(event, leftStuff));
  inputElements[1].addEventListener('change', (event) => onFileChange(event, rightStuff));
});
