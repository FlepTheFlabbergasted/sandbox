import './scripts/cv-retrofuterism.js';
import PanelSnap from 'panelsnap';
import './scripts/compare-image-delta-e.js';
import './scripts/infinite-well.js';
import './scripts/retrofuturism/broadcast-towers-percentage.js';
import './scripts/retrofuturism/loading-bar.js';
import './scripts/retrofuturism/planet.js';
import './scripts/retrofuturism/reactors.js';
import './scripts/retrofuturism/sat-data-link-console.js';
import './scripts/retrofuturism/sat-data-link-status.js';
import './scripts/retrofuturism/sat-data-link-upload-speed.js';
import './scripts/retrofuturism/tiles.js';
import './scripts/retrofuturism/transmission-1-khz.js';
import './scripts/retrofuturism/transmission-2-scan.js';
import './scripts/side-menu.js';
import './scripts/string-rings.js';
import './scripts/text-shape-highlight.js';

window.addEventListener('load', () => {
  const panelSnap = new PanelSnap({
    container: document.body,
    panelSelector: '> section',
    directionThreshold: 100,
    delay: 0,
    duration: 300,
    easing: (t) => t,
  });

  panelSnap.on('activatePanel', (activatePanel) => setSectionUrlHash(activatePanel.id));
});

function setSectionUrlHash(sectionId) {
  history.replaceState(undefined, undefined, `#${sectionId}`);
}
