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

let selectedRing = undefined;
let selectedRingSelectionControl = undefined;

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
    getComputedStyle(selectedRing).getPropertyValue(borderRadiusToModify).replace('%', '')
  );

  const mouseMove = (event) => {
    const { clientX: x, clientY: y } = event;
    const currentDistance = getDistanceToCorner(borderRadiusToModify, x, y, width, height);

    if (startingDistance > currentDistance) {
      const movedDistance = startingDistance - currentDistance;
      const modifiedDistance = Math.round(movedDistance / DRAG_DISTANCE_MODIFIER);

      selectedRing.style.setProperty(
        borderRadiusToModify,
        `${initialBorderRadius - modifiedDistance < 0 ? 0 : initialBorderRadius - modifiedDistance}%`
      );
    } else {
      const movedDistance = currentDistance - startingDistance;
      const modifiedDistance = Math.round(movedDistance / DRAG_DISTANCE_MODIFIER);

      selectedRing.style.setProperty(
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
      selectedRing.style.setProperty('--rotation-x', `${sliderRotationX.value}deg`);
      selectedRing.style.setProperty('--rotation-y', `${sliderRotationY.value}deg`);
      selectedRing.style.setProperty('--rotation-z', `${sliderRotationZ.value}deg`);
    })
  );
};

const addNewRing = (id, color = '#ffffff') => {
  const newRingControlsNode = htmlToNode(createNewRingControlsHtml(id, color));
  const newRingNode = htmlToNode(createNewRingHtml(id, color));

  getRingSelectionControl(id, newRingControlsNode).addEventListener('input', ringSelectionControlInputEventListener);

  const ringColorControl = getRingColorControl(id, newRingControlsNode);
  ringColorControl.addEventListener('input', (event) => ringColorControlInputEventListener(id, event));
  ringColorControl.addEventListener('focus', () => ringsContainer.classList.add('show-ring-colors'));
  ringColorControl.addEventListener('blur', () => ringsContainer.classList.remove('show-ring-colors'));
  getRemoveRingButton(id, newRingControlsNode).addEventListener('click', () => {
    ringSelectionControlsContainer.removeChild(getRingControls(id));
    ringsContainer.removeChild(getRing(id));
  });

  ringSelectionControlsContainer.appendChild(newRingControlsNode);
  ringsContainer.appendChild(newRingNode);

  setSelectedRing(id);
  ringSelectionControlInputEventListener({ target: { value: id } });
};

// TODO: This will eventually be able to be removed
const ringSelectionControlInputEventListener = (event) => {
  setSelectedRing(event.target.value);
  const computedStyle = getComputedStyle(selectedRing);

  sliderRotationX.value = computedStyle.getPropertyValue('--rotation-x').replace('deg', '');
  sliderRotationY.value = computedStyle.getPropertyValue('--rotation-y').replace('deg', '');
  sliderRotationZ.value = computedStyle.getPropertyValue('--rotation-z').replace('deg', '');
};

const ringColorControlInputEventListener = (id, event) => {
  getRingColorLabel(id).textContent = event.target.value;
  getRing(id).style.setProperty('--color', event.target.value);
};

const createNewRingControlsHtml = (id, color) => {
  return `
<div id="ring-controls-${id}" class="d-flex flex-row flex-items-center gap-xxs">
  <input type="radio" id="ring-selection-control-${id}" name="ring-selection" value="${id}" checked />
  <label class="color-picker-wrapper" for="ring-selection-control-${id}">
    <span>${color}</span>
    <input type="color" id="ring-color-${id}" name="ring-color" value="${color}" />
  </label>
  <button class="control-button" id="remove-ring-button-${id}">-</button>
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
  selectedRing = getRing(id);
  selectedRingSelectionControl = getRingSelectionControl(id);
};

const getRing = (id, container = ringsContainer) => {
  return container.querySelector(`#ring-${id}`);
};

const getRingControls = (id, container = ringSelectionControlsContainer) => {
  return container.querySelector(`#ring-controls-${id}`);
};

const getRingSelectionControl = (id, container = ringSelectionControlsContainer) => {
  return container.querySelector(`#ring-selection-control-${id}`);
};

const getRingColorControl = (id, container = ringSelectionControlsContainer) => {
  return container.querySelector(`#ring-color-${id}`);
};

const getRingColorLabel = (id, container = ringSelectionControlsContainer) => {
  return container.querySelector(`label[for="ring-selection-control-${id}"] span`);
};

const getRemoveRingButton = (id, container = ringSelectionControlsContainer) => {
  return container.querySelector(`#remove-ring-button-${id}`);
};

window.addEventListener('load', () => {
  addEventListeners();
  // #1c92ff
  // #ffe345
  // #d705e1
  addNewRing(0, '#000000');
});
