import { getRandomInt } from '../../util/get-random-int';

const sectionEl = document.getElementById('retrofuturism');
const percentageDivs = sectionEl.querySelectorAll('.broadcast-towers-percentage');
const broadcastTowersListDiv = sectionEl.querySelector('#broadcast-towers-list');

const animateValue = (percentageDiv, start, end, duration) => {
  let startTimestamp = null;

  const step = (timestamp) => {
    if (!startTimestamp) {
      startTimestamp = timestamp;
    }

    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    percentageDiv.innerHTML = Math.floor(progress * (end - start) + start) + '%';

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      blinkFilledClass(percentageDiv, 6);
    }
  };

  window.requestAnimationFrame(step);
};

const blinkFilledClass = (percentageDiv, times) => {
  if (times % 2 === 0) {
    percentageDiv.parentElement.classList.remove('filled');
  } else {
    percentageDiv.parentElement.classList.add('filled');
  }

  times--;
  if (times >= 0) {
    setTimeout(() => blinkFilledClass(percentageDiv, times), 750);
  } else {
    const removedDiv = broadcastTowersListDiv.removeChild(percentageDiv.parentElement);
    setTimeout(
      () => {
        broadcastTowersListDiv.appendChild(removedDiv);
        animateValue(
          removedDiv.querySelector('.broadcast-towers-percentage'),
          getRandomInt(0, 90),
          100,
          getRandomInt(5000, 25000)
        );
      },
      getRandomInt(3000, 10000)
    );
  }
};

window.addEventListener('load', () => {
  Array.from(percentageDivs).forEach((percentageDiv) =>
    animateValue(percentageDiv, getRandomInt(0, 90), 100, getRandomInt(5000, 25000))
  );
});
