import { getRandomInt } from '../../util/get-random-int';

const sectionEl = document.getElementById('retrofuturism');
const reactorsDiv = sectionEl.querySelector('#reactors');
const reactorDivs = reactorsDiv.querySelectorAll('.reactor');
const arrowRightDivs = reactorsDiv.querySelectorAll('.arrow-right');
const arrowLeftDivs = reactorsDiv.querySelectorAll('.arrow-left');

const TIMEOUT_MS = 2000;
const ACTIVE_REACTORS_AT_A_TIME = 4;

const setRandomActive = () => {
  for (const reactorDiv of reactorDivs) {
    reactorDiv.classList.remove('active');
  }

  for (const arrowRightDiv of arrowRightDivs) {
    arrowRightDiv.classList.remove('active');
  }

  for (const arrowLeftDiv of arrowLeftDivs) {
    arrowLeftDiv.classList.remove('active');
  }

  for (let i = 0; i < ACTIVE_REACTORS_AT_A_TIME; i++) {
    const randomInt = getRandomInt(0, reactorDivs.length - 1);
    const row = randomInt % 4;

    reactorDivs[randomInt].classList.add('active');
    arrowRightDivs[row].classList.add('active');
    arrowLeftDivs[row].classList.add('active');
  }

  setTimeout(() => setRandomActive(), TIMEOUT_MS);
};

window.addEventListener('load', () => {
  setRandomActive();
});
