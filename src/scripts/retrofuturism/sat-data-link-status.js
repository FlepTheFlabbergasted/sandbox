import { EventTypes } from './consts';

const sectionEl = document.getElementById('retrofuturism');
const satDataLinkStatusDiv = sectionEl.querySelector('#sat-data-link-status');

window.addEventListener(EventTypes.SatelliteDataLinkUp, () => {
  satDataLinkStatusDiv.innerHTML = 'CONNECTED';
});

window.addEventListener(EventTypes.SatelliteDataLinkDown, () => {
  satDataLinkStatusDiv.innerHTML = 'DISCONNECTED';
});
