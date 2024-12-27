import { EventTypes } from './consts';

const sectionEl = document.getElementById('retrofuturism');
const satDataLinkUploadSpeedDiv = sectionEl.querySelector('#sat-data-link-upload-speed');

window.addEventListener(EventTypes.SatDataUploadBegin, () => {
  satDataLinkUploadSpeedDiv.classList.add('animate-nr');
});

window.addEventListener(EventTypes.SatDataUploadEnd, () => {
  satDataLinkUploadSpeedDiv.classList.remove('animate-nr');
});
