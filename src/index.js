const container = document.querySelector('.section-container');

// TODO: Can't zoom in
// container.addEventListener('wheel', (event) => {
//   event.preventDefault();
//   const delta = event.deltaY;

//   container.scrollBy({ top: delta, behavior: 'smooth' });
// });

// https://stackoverflow.com/a/66029649/11763719
function scrollHandler(e) {
  var atSnappingPoint = e.target.scrollTop % e.target.offsetHeight === 0;
  var timeOut = atSnappingPoint ? 0 : 500; //see notes

  clearTimeout(e.target.scrollTimeout); //clear previous timeout

  e.target.scrollTimeout = setTimeout(function () {
    console.log('Scrolling stopped!');
  }, timeOut);
}

container.addEventListener('scroll', scrollHandler);
