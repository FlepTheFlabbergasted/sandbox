import { getRandomInt } from '../util/get-random-int';
import { htmlToNode } from '../util/html-to-nodes';
import { mapValue } from '../util/map-value';
import { throttle } from '../util/throttle';

const sectionEl = document.getElementById('string-rings');

const cornerGradientOverlay = sectionEl.querySelector('#corner-gradient-overlay');

const addRingButton = sectionEl.querySelector('#add-ring-button');
const ringsContainer = sectionEl.querySelector('#rings-container');
const ringSelectionControlsContainer = sectionEl.querySelector('#ring-selection-controls-container');

const rotationSliders = sectionEl.querySelectorAll(`input[data-slider-type='rotation']`);
const sliderRotationX = sectionEl.querySelectorAll(`input[name='rotation-x']`)[0];
const sliderRotationY = sectionEl.querySelectorAll(`input[name='rotation-y']`)[0];
const sliderRotationZ = sectionEl.querySelectorAll(`input[name='rotation-z']`)[0];

const DRAG_DISTANCE_MODIFIER = 4;

let selectedRingNode = undefined;
let selectedRingControlNode = undefined;

const getWhichBorderRadiusToModify = (x, y) => {
  if (y < window.innerHeight / 2) {
    if (x < window.innerWidth / 2) {
      return '--border-radius-TL';
    } else {
      return '--border-radius-TR';
    }
  } else {
    if (x < window.innerWidth / 2) {
      return '--border-radius-BL';
    } else {
      return '--border-radius-BR';
    }
  }
};

const getDistanceToCorner = (borderRadius, x, y, width, height) => {
  if (borderRadius === '--border-radius-TL') {
    return Math.sqrt(x ** 2 + y ** 2);
  } else if (borderRadius === '--border-radius-TR') {
    return Math.sqrt((width - x) ** 2 + y ** 2);
  } else if (borderRadius === '--border-radius-BL') {
    return Math.sqrt(x ** 2 + (height - y) ** 2);
  } else if (borderRadius === '--border-radius-BR') {
    return Math.sqrt((width - x) ** 2 + (height - y) ** 2);
  }
};

function mouseDown(event) {
  // Don't do anything if user clicks any other element
  if (event.target.matches('input, textarea, select')) {
    return;
  }

  const { clientX: startX, clientY: startY, view } = event;
  const { innerWidth: width, innerHeight: height } = view;
  const borderRadiusToModify = getWhichBorderRadiusToModify(startX, startY);
  const startingDistance = getDistanceToCorner(borderRadiusToModify, startX, startY, width, height);
  const initialBorderRadius = Number(
    getComputedStyle(selectedRingNode).getPropertyValue(borderRadiusToModify).replace('%', '')
  );

  const mouseMove = (event) => {
    const { clientX: x, clientY: y } = event;
    const currentDistance = getDistanceToCorner(borderRadiusToModify, x, y, width, height);

    if (startingDistance > currentDistance) {
      const movedDistance = startingDistance - currentDistance;
      const modifiedDistance = Math.round(movedDistance / DRAG_DISTANCE_MODIFIER);

      selectedRingNode.style.setProperty(
        borderRadiusToModify,
        `${initialBorderRadius - modifiedDistance < 0 ? 0 : initialBorderRadius - modifiedDistance}%`
      );
    } else {
      const movedDistance = currentDistance - startingDistance;
      const modifiedDistance = Math.round(movedDistance / DRAG_DISTANCE_MODIFIER);

      selectedRingNode.style.setProperty(
        borderRadiusToModify,
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
    const distTL = getDistanceToCorner('--border-radius-TL', x, y, width, height);
    opacityTL = mapValue(distTL, 0, maxDist, maxOpacity, 0);
  }
  if (x >= width / 2 && y <= height / 2) {
    const distTR = getDistanceToCorner('--border-radius-TR', x, y, width, height);
    opacityTR = mapValue(distTR, 0, maxDist, maxOpacity, 0);
  }
  if (x <= width / 2 && y >= height / 2) {
    const distBL = getDistanceToCorner('--border-radius-BL', x, y, width, height);
    opacityBL = mapValue(distBL, 0, maxDist, maxOpacity, 0);
  }
  if (x >= width / 2 && y >= height / 2) {
    const distBR = getDistanceToCorner('--border-radius-BR', x, y, width, height);
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
  ringControlSelectionInputEventListener({ target: { value: id } });
};

// TODO: This will eventually be able to be removed
const ringControlSelectionInputEventListener = (event) => {
  setSelectedRing(event.target.value);
  const computedStyle = getComputedStyle(selectedRingNode);

  sliderRotationX.value = computedStyle.getPropertyValue('--rotation-x').replace('deg', '');
  sliderRotationY.value = computedStyle.getPropertyValue('--rotation-y').replace('deg', '');
  sliderRotationZ.value = computedStyle.getPropertyValue('--rotation-z').replace('deg', '');

  console.log(sliderRotationX.value, sliderRotationY.value, sliderRotationZ.value);
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
  --border-radius-TL: 50%;
  --border-radius-TR: 50%;
  --border-radius-BL: 50%;
  --border-radius-BR: 50%;
  --rotation-x: 0deg;
  --rotation-y: 0deg;
  --rotation-z: 360deg;
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
