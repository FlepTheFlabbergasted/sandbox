import { getRandomInt } from '../util/get-random-int';
import { htmlToNode } from '../util/html-to-nodes';
import { mapValue } from '../util/map-value';
import { throttle } from '../util/throttle';

const sectionEl = document.getElementById('string-rings');

const cornerGradientOverlay = sectionEl.querySelector('#corner-gradient-overlay');

const addRingButton = sectionEl.querySelector('#add-ring-button');
const ringsContainer = sectionEl.querySelector('#rings-container');
const ringSelectionControlsContainer = sectionEl.querySelector('#ring-selection-controls-container');

const borderRadiusSliders = sectionEl.querySelectorAll(`input[data-slider-type='border-radius']`);
const sliderTopLeft = sectionEl.querySelectorAll(`input[name='top-left']`)[0];
const sliderTopRight = sectionEl.querySelectorAll(`input[name='top-right']`)[0];
const sliderBottomLeft = sectionEl.querySelectorAll(`input[name='bottom-left']`)[0];
const sliderBottomRight = sectionEl.querySelectorAll(`input[name='bottom-right']`)[0];

const rotationSliders = sectionEl.querySelectorAll(`input[data-slider-type='rotation']`);
const sliderRotationX = sectionEl.querySelectorAll(`input[name='rotation-x']`)[0];
const sliderRotationY = sectionEl.querySelectorAll(`input[name='rotation-y']`)[0];
const sliderRotationZ = sectionEl.querySelectorAll(`input[name='rotation-z']`)[0];

const DRAG_DISTANCE_MODIFIER = 4;

let selectedRingNode = undefined;
let selectedRingControlNode = undefined;

const getWhichBorderToModify = (x, y) => {
  if (y < window.innerHeight / 2) {
    if (x > window.innerWidth / 2) {
      return '--border-radius-top-right';
    } else {
      return '--border-radius-top-left';
    }
  } else {
    if (x > window.innerWidth / 2) {
      return '--border-radius-bottom-right';
    } else {
      return '--border-radius-bottom-left';
    }
  }
};

function mouseDown(event) {
  console.log('mouseDown');
  const startX = event.clientX;
  const startY = event.clientY;
  const borderToModify = getWhichBorderToModify(startX, startY);
  const initialBorderRadius = Number(
    getComputedStyle(selectedRingNode).getPropertyValue(borderToModify).replace('%', '')
  );

  const mouseMove = (event) => {
    console.log('mouseMove');
    const distance = Math.sqrt((event.clientX - startX) ** 2 + (event.clientY - startY) ** 2);
    const modifiedDistance = Math.round(distance / DRAG_DISTANCE_MODIFIER);

    if (startX > event.clientX) {
      // console.log('Going left');
    } else {
      // console.log('Going right');
    }

    if (startY > event.clientY) {
      selectedRingNode.style.setProperty(
        borderToModify,
        `${modifiedDistance > initialBorderRadius ? 0 : initialBorderRadius - modifiedDistance}%`
      );
    } else {
      selectedRingNode.style.setProperty(
        borderToModify,
        `${initialBorderRadius + modifiedDistance > 100 ? 100 : initialBorderRadius + modifiedDistance}%`
      );
    }
  };

  const mouseUp = () => {
    this.removeEventListener('mousemove', throttledMouseMoveFn);
    this.removeEventListener('mouseup', mouseUp);
  };

  const throttledMouseMoveFn = throttle(mouseMove);
  this.addEventListener('mousemove', throttledMouseMoveFn);
  this.addEventListener('mouseup', mouseUp);
}

const setEdgeGradientOpacities = (event) => {
  const { clientX: x, clientY: y, view } = event;
  const { innerWidth: width, innerHeight: height } = view;

  // Calculate the distances from each corner
  const distTL = Math.sqrt(x ** 2 + y ** 2); // Top-left corner
  const distTR = Math.sqrt((width - x) ** 2 + y ** 2); // Top-right corner
  const distBL = Math.sqrt(x ** 2 + (height - y) ** 2); // Bottom-left corner
  const distBR = Math.sqrt((width - x) ** 2 + (height - y) ** 2); // Bottom-right corner

  // Calculate the maximum possible distance (diagonal within each quadrant)
  const maxDist = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);

  // Calculate the opacity for each corner, clamped to a maximum of 40%
  const maxOpacity = 0.4;
  let opacityTL = 0;
  let opacityTR = 0;
  let opacityBL = 0;
  let opacityBR = 0;

  // Intensity increases from 0 to 0.4 as the mouse moves closer to the corner
  // Setting the `maxInstensity` as `outMin` flips the mapping relationship
  if (x <= width / 2 && y <= height / 2) {
    opacityTL = mapValue(distTL, 0, maxDist, maxOpacity, 0);
  }
  if (x >= width / 2 && y <= height / 2) {
    opacityTR = mapValue(distTR, 0, maxDist, maxOpacity, 0);
  }
  if (x <= width / 2 && y >= height / 2) {
    opacityBL = mapValue(distBL, 0, maxDist, maxOpacity, 0);
  }
  if (x >= width / 2 && y >= height / 2) {
    opacityBR = mapValue(distBR, 0, maxDist, maxOpacity, 0);
  }

  // Explanation for '~~': https://j11y.io/cool-stuff/double-bitwise-not/
  // https://stackoverflow.com/a/39986149/11763719
  cornerGradientOverlay.style.setProperty('--corner-gradient-opacity-tl', ~~(opacityTL * 100));
  cornerGradientOverlay.style.setProperty('--corner-gradient-opacity-tr', ~~(opacityTR * 100));
  cornerGradientOverlay.style.setProperty('--corner-gradient-opacity-bl', ~~(opacityBL * 100));
  cornerGradientOverlay.style.setProperty('--corner-gradient-opacity-br', ~~(opacityBR * 100));
};

const addEventListeners = () => {
  window.addEventListener('mousedown', mouseDown);

  window.addEventListener('mousemove', setEdgeGradientOpacities);

  addRingButton.addEventListener('click', () => {
    const id = getRandomInt(0, 100000);
    addNewRing(id);
  });

  Array.from(borderRadiusSliders).forEach((slider) =>
    slider.addEventListener('input', () => {
      selectedRingNode.style.setProperty('--border-radius-top-left', `${sliderTopLeft.value}%`);
      selectedRingNode.style.setProperty('--border-radius-top-right', `${sliderTopRight.value}%`);
      selectedRingNode.style.setProperty('--border-radius-bottom-left', `${sliderBottomLeft.value}%`);
      selectedRingNode.style.setProperty('--border-radius-bottom-right', `${sliderBottomRight.value}%`);
    })
  );

  Array.from(rotationSliders).forEach((slider) =>
    slider.addEventListener('input', () => {
      selectedRingNode.style.setProperty('--rotation-x', `${sliderRotationX.value}deg`);
      selectedRingNode.style.setProperty('--rotation-y', `${sliderRotationY.value}deg`);
      selectedRingNode.style.setProperty('--rotation-z', `${sliderRotationZ.value}deg`);
    })
  );
};

const addNewRing = (id, color = '#ffffff') => {
  const newRingControlNode = htmlToNode(createNewRingControlHtml(id, color));
  const newRingNode = htmlToNode(createNewRingHtml(id, color));

  newRingControlNode.addEventListener('input', ringControlSelectionInputEventListener);

  ringSelectionControlsContainer.appendChild(newRingControlNode);
  ringsContainer.appendChild(newRingNode);

  setSelectedRing(id);

  ringControlSelectionInputEventListener();
};

const ringControlSelectionInputEventListener = () => {
  const computedStyle = getComputedStyle(selectedRingNode);

  sliderTopLeft.value = computedStyle.getPropertyValue('--border-radius-top-left').replace('%', '');
  sliderTopRight.value = computedStyle.getPropertyValue('--border-radius-top-right').replace('%', '');
  sliderBottomRight.value = computedStyle.getPropertyValue('--border-radius-bottom-left').replace('%', '');
  sliderBottomLeft.value = computedStyle.getPropertyValue('--border-radius-bottom-right').replace('%', '');

  sliderRotationX.value = computedStyle.getPropertyValue('--rotation-x');
  sliderRotationY.value = computedStyle.getPropertyValue('--rotation-y');
  sliderRotationZ.value = computedStyle.getPropertyValue('--rotation-z');
};

const createNewRingControlHtml = (id, color) => {
  return `
<div class="d-flex flex-row flex-items-center gap-xxs">
  <input type="radio" id="ring-control-${id}" name="ring-selection" value="${id}" checked />
  <label class="ring-selection-control-label" for="first-ring">${color}</label>
  <button class="control-button">-</button>
</div>`.trim();
};

const createNewRingHtml = (id, color) => {
  return `
<i
  id="ring-${id}"
  class="ring"
  style="--color: ${color};
  --border-radius-top-left: 50%;
  --border-radius-top-right: 50%;
  --border-radius-bottom-left: 50%;
  --border-radius-bottom-right: 50%;
  "
>
</i>`.trim();
};

const setSelectedRing = (id) => {
  selectedRingNode = getRing(id);
  selectedRingControlNode = getRingControl(id);
};

const getRing = (id) => {
  return ringsContainer.querySelector(`#ring-${id}`);
};

const getRingControl = (id) => {
  return ringSelectionControlsContainer.querySelector(`#ring-control-${id}`);
};

window.addEventListener('load', () => {
  addEventListeners();
  // #1c92ff
  // #ffe345
  // #d705e1
  addNewRing(0, '#d705e1');
});
