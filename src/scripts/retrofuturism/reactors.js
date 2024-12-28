import { getRandomInt } from '../../util/get-random-int';

const sectionEl = document.getElementById('retrofuturism');
const reactorsDiv = sectionEl.querySelector('#reactors');
const reactorDivs = reactorsDiv.querySelectorAll('.reactor');

const TIMEOUT_MS = 2000;
const ACTIVE_REACTORS_AT_A_TIME = 4;

const setRandomActive = () => {
  for (const reactorDiv of reactorDivs) {
    reactorDiv.classList.remove('active');
  }

  for (let i = 0; i < ACTIVE_REACTORS_AT_A_TIME; i++) {
    reactorDivs[getRandomInt(0, reactorDivs.length - 1)].classList.add('active');
  }

  setTimeout(() => setRandomActive(), TIMEOUT_MS);
};

window.addEventListener('load', () => {
  setRandomActive();
});
