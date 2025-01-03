const sectionEl = document.getElementById('string-rings');

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

const borderRadiusResultsEl = sectionEl.querySelector('#border-radius-results');
const rotationResultsEl = sectionEl.querySelector('#rotation-results');

let ringSelectionIndex = 0;

const addEventListeners = () => {
  Array.from(ringSelectionRadioButtons).forEach((radioButton) =>
    radioButton.addEventListener('input', (event) => {
      ringSelectionIndex = Number(event.target.value);

      const computedStyle = getComputedStyle(rings[ringSelectionIndex]);

      sliderTopLeft.value = computedStyle.getPropertyValue('--border-radius-top-left').replace('%', '');
      sliderTopRight.value = computedStyle.getPropertyValue('--border-radius-top-right').replace('%', '');
      sliderBottomRight.value = computedStyle.getPropertyValue('--border-radius-bottom-left').replace('%', '');
      sliderBottomLeft.value = computedStyle.getPropertyValue('--border-radius-bottom-right').replace('%', '');

      sliderRotationX.value = computedStyle.getPropertyValue('--rotation-x');
      sliderRotationY.value = computedStyle.getPropertyValue('--rotation-y');
      sliderRotationZ.value = computedStyle.getPropertyValue('--rotation-z');

      borderRadiusResultsEl.innerHTML = `${sliderTopLeft.value}% ${sliderTopRight.value}% ${sliderBottomLeft.value}% ${sliderBottomRight.value}%`;
      rotationResultsEl.innerHTML = `rotateX(${sliderRotationX.value}deg) rotateY(${sliderRotationY.value}deg) rotateZ(${sliderRotationZ.value}deg)`;
    })
  );

  Array.from(borderRadiusSliders).forEach((slider) =>
    slider.addEventListener('input', () => {
      rings[ringSelectionIndex].style.setProperty('--border-radius-top-left', `${sliderTopLeft.value}%`);
      rings[ringSelectionIndex].style.setProperty('--border-radius-top-right', `${sliderTopRight.value}%`);
      rings[ringSelectionIndex].style.setProperty('--border-radius-bottom-left', `${sliderBottomLeft.value}%`);
      rings[ringSelectionIndex].style.setProperty('--border-radius-bottom-right', `${sliderBottomRight.value}%`);
      borderRadiusResultsEl.innerHTML = `${sliderTopLeft.value}%  ${sliderTopRight.value}%  ${sliderBottomRight.value}%  ${sliderBottomLeft.value}%`;
    })
  );

  Array.from(rotationSliders).forEach((slider) =>
    slider.addEventListener('input', () => {
      rings[ringSelectionIndex].style.setProperty('--rotation-x', `${sliderRotationX.value}deg`);
      rings[ringSelectionIndex].style.setProperty('--rotation-y', `${sliderRotationY.value}deg`);
      rings[ringSelectionIndex].style.setProperty('--rotation-z', `${sliderRotationZ.value}deg`);
      rotationResultsEl.innerHTML = `rotateX(${sliderRotationX.value}deg) rotateY(${sliderRotationY.value}deg) rotateZ(${sliderRotationZ.value}deg)`;
    })
  );
};

window.addEventListener('load', () => {
  addEventListeners();
});
