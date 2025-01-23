const sectionEl = document.getElementById('retrofuturism');
const planetDiv = sectionEl.querySelector('#planet');

const setPlanetRadiusCssVariable = () => {
  planetDiv.style.setProperty('--planet-radius-px', planetDiv.offsetWidth / 2);
};

window.addEventListener('load', () => {
  setPlanetRadiusCssVariable();
});
window.addEventListener('resize', () => {
  setPlanetRadiusCssVariable();
});
