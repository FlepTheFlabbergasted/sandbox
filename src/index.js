import PanelSnap from 'panelsnap';
import './scripts/side-menu';

const body = document.body;

body.onload = () => {
  const panelSnap = new PanelSnap({
    container: body,
    panelSelector: '> section',
    directionThreshold: 100,
    delay: 0,
    duration: 300,
    easing: (t) => t,
  });

  panelSnap.on('activatePanel', (activatePanel) => setSectionUrlHash(activatePanel.id));
};

function setSectionUrlHash(sectionId) {
  history.replaceState(undefined, undefined, `#${sectionId}`);
}
