const sectionEl = document.getElementById('string-rings');

const sliders = sectionEl.querySelectorAll(`input`);
const sliderTopLeft = sectionEl.querySelectorAll(`input[name='top-left']`)[0];
const sliderTopRight = sectionEl.querySelectorAll(`input[name='top-right']`)[0];
const sliderBottomRight = sectionEl.querySelectorAll(`input[name='bottom-right']`)[0];
const sliderBottomLeft = sectionEl.querySelectorAll(`input[name='bottom-left']`)[0];
const sliderTopLeft2 = sectionEl.querySelectorAll(`input[name='top-left2']`)[0];
const sliderTopRight2 = sectionEl.querySelectorAll(`input[name='top-right2']`)[0];
const sliderBottomRight2 = sectionEl.querySelectorAll(`input[name='bottom-right2']`)[0];
const sliderBottomLeft2 = sectionEl.querySelectorAll(`input[name='bottom-left2']`)[0];

const ringEl = sectionEl.getElementsByClassName('ring')[0];
const resultEl = sectionEl.querySelector('#results');

const addEventListenersToSliders = () => {
  Array.from(sliders).forEach((slider) =>
    slider.addEventListener('input', () => {
      const newBorderRadius = `
      ${sliderTopLeft.value}%  ${sliderTopRight.value}%  ${sliderBottomRight.value}%  ${sliderBottomLeft.value}% /
      ${sliderTopLeft2.value}% ${sliderTopRight2.value}% ${sliderBottomRight2.value}% ${sliderBottomLeft2.value}%`;

      ringEl.style.borderRadius = newBorderRadius;
      resultEl.innerHTML = newBorderRadius;
    })
  );
};

window.addEventListener('load', () => {
  addEventListenersToSliders();
});
