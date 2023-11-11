const body = document.body;
const container = document.querySelector('#section-container');
const sections = document.querySelectorAll('.section');

body.onload = () => {
  if (window.location.hash) {
    scrollToSection(window.location.hash);
  } else {
    setSectionUrlHash(sections[0].id);
  }

  container.addEventListener('scrollend', scrollEndHandler);
};

function scrollEndHandler() {
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

    if (isVisible) {
      setSectionUrlHash(section.id);
    }
  }
}

function setSectionUrlHash(sectionId) {
  history.replaceState(undefined, undefined, `#${sectionId}`);
}

function enableSnapScrolling() {
  console.log(`ENABLEING SNAP SCROLLING`);
  // body.style.setProperty('height', '100%');
  // body.style.removeProperty('overflow-y');
  // container.style.setProperty('height', '100%');
  // setTimeout(() => {
  //   container.style.setProperty('-webkit-overflow-scrolling', 'touch');
  //   container.style.setProperty('overflow-anchor', 'none');
  //   container.style.setProperty('overflow-y', 'auto');
  //   container.style.setProperty('scroll-snap-type', 'y mandatory');
  //   container.style.setProperty('scroll-snap-stop', 'normal');
  //   container.style.setProperty('scroll-behavior', 'auto');
  // }, 0);
}

function disableSnapScrolling() {
  // body.style.setProperty('height', 'auto');
  // body.style.setProperty('overflow-y', 'auto');
  // container.style.setProperty('height', 'auto');
  // setTimeout(() => {
  //   container.style.removeProperty('-webkit-overflow-scrolling');
  //   container.style.removeProperty('overflow-anchor');
  //   container.style.removeProperty('overflow-y');
  //   container.style.removeProperty('scroll-snap-type');
  //   container.style.removeProperty('scroll-snap-stop');
  //   container.style.removeProperty('scroll-behavior');
  // }, 0);
}

function scrollToSection(sectionId) {
  const section = document.querySelector(sectionId);

  if (section) {
    // disableSnapScrolling();
    console.log(`Scrolling to ${sectionId} (${section.offsetTop}px)`);
    setTimeout(() => window.scrollTo(0, section.offsetTop), 0);

    // setTimeout(() => {
    //   enableSnapScrolling();
    // }, 2000);
  }
}
