import { getRandomInt } from '../../util/get-random-int.js';

const CHANGE_INTERVAL_MS = 500;
const CHANGE_AMOUNT_MIN = 5;
const CHANGE_AMOUNT_MAX = 63;
const NR_CHANGES_PER_ROUND = 5;

const sectionEl = document.getElementById('retrofuturism');
const numberSpan = sectionEl.querySelector('#transmission-1-khz');

let roundCounter = 0;
let operation;

const changeKhzNumber = () => {
  if (roundCounter !== NR_CHANGES_PER_ROUND - 1) {
    roundCounter++;
  } else {
    roundCounter = 0;
    operation = Math.random() >= 0.5 ? '+' : '-';
  }

  if (operation === '+') {
    numberSpan.innerHTML = Number(numberSpan.innerHTML) + getRandomInt(CHANGE_AMOUNT_MIN, CHANGE_AMOUNT_MAX);
  } else {
    numberSpan.innerHTML = Math.abs(Number(numberSpan.innerHTML) - getRandomInt(CHANGE_AMOUNT_MIN, CHANGE_AMOUNT_MAX));
  }

  setTimeout(() => changeKhzNumber(), CHANGE_INTERVAL_MS);
};

window.addEventListener('load', () => {
  numberSpan.innerHTML = getRandomInt(2000, 7000);
  changeKhzNumber(numberSpan);
});
