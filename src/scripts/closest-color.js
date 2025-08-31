const sectionEl = document.getElementById('closest-color');

const inputElements = sectionEl.querySelectorAll('input[type=file]');
const inputElLeft = inputElements[0];
const inputElRight = inputElements[1];

const canvasElements = sectionEl.querySelectorAll('canvas');
canvasElements.forEach((el) => {
  el.width = '500';
  el.height = '309';
});
const canvasElLeft = canvasElements[0];
const canvasElRight = canvasElements[1];

const colorCells = sectionEl.querySelectorAll('.color-cell-container .color-cell');
const hoveredColorCellLeft = colorCells[0];
const selectedColorCellLeft = colorCells[1];
const hoveredColorCellRight = colorCells[2];
const selectedColorCellRight = colorCells[3];

const stuffLeft = {
  canvasEl: canvasElLeft,
  canvasCtx: canvasElLeft.getContext('2d', { willReadFrequently: true }),
  hoveredColorCell: hoveredColorCellLeft,
  selectedColorCell: selectedColorCellLeft,
  mouseMoveEventListener: undefined,
  clickEventListener: undefined,
  img: undefined,
  pickerX: 0,
  pickerY: 0,
};

const stuffRight = {
  canvasEl: canvasElRight,
  canvasCtx: canvasElRight.getContext('2d', { willReadFrequently: true }),
  hoveredColorCell: hoveredColorCellRight,
  selectedColorCell: selectedColorCellRight,
  mouseMoveEventListener: undefined,
  clickEventListener: undefined,
  img: undefined,
  pickerX: 0,
  pickerY: 0,
};

const onFileChange = (event, stuff) => {
  if (event.target.files.length !== 1) {
    return;
  }

  const file = event.target.files[0];
  const fileObjectUrl = URL.createObjectURL(file);
  const img = new Image();

  img.addEventListener('load', () => {
    drawCanvasImage(stuff.canvasEl, stuff.img);

    stuff.canvasEl.removeEventListener('mousemove', stuff.mouseMoveEventListener);
    stuff.canvasEl.removeEventListener('click', stuff.clickEventListener);

    stuff.canvasEl.addEventListener('mousemove', (event) => onMouseMove(event, stuff));
    stuff.canvasEl.addEventListener('click', () => pickColor(stuff, stuff.selectedColorCell));

    URL.revokeObjectURL(fileObjectUrl);
  });

  img.src = fileObjectUrl;
  stuff.img = img;
};

const onMouseMove = (event, stuff) => {
  stuff.pickerX = event.clientX;
  stuff.pickerY = event.clientY;

  drawCanvasImage(stuff.canvasEl, stuff.img);
  movePicker(stuff);
  pickColor(stuff, stuff.hoveredColorCell);
};

const movePicker = (stuff) => {
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
const drawCanvasImage = (canvasEl, img) => {
  // let imgWidth = img.naturalWidth;
  // let imgHeight = img.naturalHeight;
  // let canvasWidth = canvasEl.width;
  // let canvasHeight = canvasEl.height;

  // let scaleX = 1;
  // if (imgWidth > canvasWidth) {
  //   scaleX = canvasWidth / imgWidth;
  // }

  // let scaleY = 1;
  // if (imgHeight > canvasHeight) {
  //   scaleY = canvasHeight / imgHeight;
  // }

  // let scale = scaleY;
  // if (scaleX < scaleY) {
  //   scale = scaleX;
  // }

  // if (scale < 1) {
  //   // Gotta ceil so no fractions are present since repeated calls will decrease the values
  //   canvasEl.width = Math.ceil(imgWidth * scale);
  //   canvasEl.height = Math.ceil(imgHeight * scale);
  // }

  // canvasEl.height = imgHeight;
  // canvasEl.width = imgWidth;

  // console.log(imgHeight, imgWidth);

  canvasEl
    .getContext('2d')
    .drawImage(img, 0, 0, canvasEl.width, canvasEl.height, 0, 0, img.naturalWidth, img.naturalHeight);
};

// Code from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#creating_a_color_picker
const pickColor = (stuff, colorCell) => {
  console.log(stuff);
  const bounding = stuff.canvasEl.getBoundingClientRect();
  const x = stuff.pickerX - bounding.left;
  const y = stuff.pickerY - bounding.top;
  const pixel = stuff.canvasCtx.getImageData(x, y, 1, 1);
  const data = pixel.data;

  const rgbColor = `rgb(${data[0]} ${data[1]} ${data[2]} / ${data[3] / 255})`;
  colorCell.style.background = rgbColor;
  // colorCell.textContent = rgbColor;

  // console.log(rgbColor);
  // console.log(x, y);

  return rgbColor;
};

window.addEventListener('load', () => {
  inputElLeft.addEventListener('change', (event) => onFileChange(event, stuffLeft));
  inputElRight.addEventListener('change', (event) => onFileChange(event, stuffRight));
});
