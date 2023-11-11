// https://stackoverflow.com/a/66029649/11763719
function scrollHandler(e) {
  var atSnappingPoint = e.target.scrollTop % e.target.offsetHeight === 0;
  var timeOut = atSnappingPoint ? 0 : 150; //see notes

  clearTimeout(e.target.scrollTimeout); //clear previous timeout

  e.target.scrollTimeout = setTimeout(function () {}, timeOut);
}

const container = document.querySelector('#section-container');
container.addEventListener('scroll', scrollHandler);
