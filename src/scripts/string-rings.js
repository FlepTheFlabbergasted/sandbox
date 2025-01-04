import { getRandomInt } from '../util/get-random-int';
import { htmlToNode } from '../util/html-to-nodes';
import { throttle } from '../util/throttle';

const sectionEl = document.getElementById('string-rings');

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

let selectedRingNode = undefined;
let selectedRingControlNode = undefined;

function dragStart(evt) {
  const startX = evt.clientX;
  const startY = evt.clientY;
  let handleDragEventListener;
  let handleDragEndEventListener;

  const handleDrag = (event) => {
    if (startX > event.clientX) {
      console.log('Going left');
    } else {
      console.log('Going right');
    }

    if (startY < event.clientY) {
      console.log('Going down');
    } else {
      console.log('Going up');
    }

    console.log(Math.round(Math.sqrt(Math.pow(event.clientX - startX, 2) + Math.pow(event.clientY - startY, 2))));
  };

  const dragEnd = () => {
    this.removeEventListener('drag', handleDragEventListener);
    this.removeEventListener('dragend', handleDragEndEventListener);
  };

  handleDragEventListener = this.addEventListener('drag', throttle(handleDrag));
  handleDragEndEventListener = this.addEventListener('dragend', dragEnd);
}

const addEventListeners = () => {
  window.addEventListener('dragstart', dragStart);

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
  <label class="ring-selection-control-label" for="first-ring">${color}</label>
  <button class="control-button">-</button>
</div>`.trim();
};

const createNewRingHtml = (id, color) => {
  return `<i id="ring-${id}" class="ring" style="--color: ${color}"></i>`;
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
