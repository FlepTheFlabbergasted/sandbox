const container = document.querySelector('.section-container');

// TODO: Can't zoom in
container.addEventListener('wheel', (event) => {
  event.preventDefault();
  const delta = event.deltaY;

  container.scrollBy({ top: delta, behavior: 'smooth' });
});
