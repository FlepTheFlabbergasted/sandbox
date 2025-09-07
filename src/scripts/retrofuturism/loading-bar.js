import { getRandomInt } from '../../util/get-random-int.js';

const sectionEl = document.getElementById('retrofuturism');
const loadingBarDiv = sectionEl.querySelector('#loading-bar');

const DELAY_MS = 500;
const RESTART_DELAY_MS = 1000;

const advanceLoader = (percentage) => {
  loadingBarDiv.style.setProperty('--percentage-loaded', percentage);

  if (percentage >= 100) {
    setTimeout(() => advanceLoader(0), DELAY_MS + RESTART_DELAY_MS);
  } else {
    setTimeout(() => advanceLoader(percentage + getRandomInt(1, 10)), DELAY_MS);
  }
};

window.addEventListener('load', () => {
  advanceLoader(0);
});
