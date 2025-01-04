import { getRandomInt } from '../util/get-random-int';
import { htmlToNode } from '../util/html-to-nodes';

const sectionEl = document.getElementById('string-rings');

const plusEl = sectionEl.querySelector('#plus');
const ringsContainer = sectionEl.querySelector('#rings-container');
const ringControlsContainer = sectionEl.querySelector('#ring-controls-container');

const borderRadiusSliders = sectionEl.querySelectorAll(`input[data-slider-type='border-radius']`);
const sliderTopLeft = sectionEl.querySelectorAll(`input[name='top-left']`)[0];
const sliderTopRight = sectionEl.querySelectorAll(`input[name='top-right']`)[0];
const sliderBottomLeft = sectionEl.querySelectorAll(`input[name='bottom-left']`)[0];
const sliderBottomRight = sectionEl.querySelectorAll(`input[name='bottom-right']`)[0];

const rotationSliders = sectionEl.querySelectorAll(`input[data-slider-type='rotation']`);
const sliderRotationX = sectionEl.querySelectorAll(`input[name='rotation-x']`)[0];
const sliderRotationY = sectionEl.querySelectorAll(`input[name='rotation-y']`)[0];
const sliderRotationZ = sectionEl.querySelectorAll(`input[name='rotation-z']`)[0];

const rings = sectionEl.getElementsByClassName('ring');
const ringSelectionRadioButtons = sectionEl.querySelectorAll(`input[type='radio']`);

let ringSelectionIndex = 0;

let selectedRingNode = undefined;
let selectedRingControlNode = undefined;

const addEventListeners = () => {
  plusEl.addEventListener('click', () => {
    const id = getRandomInt(0, 100000);
    addNewRing(id);
  });

  Array.from(ringSelectionRadioButtons).forEach((radioButton) =>
    radioButton.addEventListener('input', (event) => ringControlSelectionInputEventListener(event))
  );

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

  newRingControlNode.addEventListener('input', (event) => ringControlSelectionInputEventListener(event));

  ringControlsContainer.insertBefore(newRingControlNode, plusEl);
  ringsContainer.appendChild(newRingNode);

  setSelectedRing(id);
};

const ringControlSelectionInputEventListener = (event) => {
  setSelectedRing(event.target.value);

  const computedStyle = getComputedStyle(selectedRingControlNode);

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
  <label for="first-ring">${color}</label>
  <div class="control-button">-</div>
</div>`.trim();
};

const createNewRingHtml = (id, color) => {
  return `<i id="ring-${id}" class="ring" style="--color: ${color}"></i>`;
};

const getRing = (id) => {
  return ringsContainer.querySelector(`#ring-${id}`);
};

const getRingControl = (id) => {
  return ringControlsContainer.querySelector(`#ring-control-${id}`);
};

const setSelectedRing = (id) => {
  selectedRingNode = getRing(id);
  selectedRingControlNode = getRingControl(id);
};

window.addEventListener('load', () => {
  addEventListeners();
  addNewRing(0, '#d705e1');
});
