const container = document.querySelector('.section-container');

container.addEventListener('wheel', (event) => {
  event.preventDefault();
  const delta = event.deltaY;

  container.scrollBy({ top: delta, behavior: 'smooth' });
});
