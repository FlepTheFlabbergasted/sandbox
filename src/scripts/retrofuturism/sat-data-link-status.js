import { EventTypes } from './consts.js';

const sectionEl = document.getElementById('retrofuturism');
const satDataLinkStatusDiv = sectionEl.querySelector('#sat-data-link-status');

window.addEventListener(EventTypes.SatDataLinkUp, () => {
  satDataLinkStatusDiv.innerHTML = 'CONNECTED';
});

window.addEventListener(EventTypes.SatDataLinkDown, () => {
  satDataLinkStatusDiv.innerHTML = 'DISCONNECTED';
});
