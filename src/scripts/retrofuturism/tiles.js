const TILE_SIZE_PX = 15;
const BLINK_INTERVAL_MS = 750;

const sectionEl = document.getElementById('retrofuturism');
const tilesContainer = sectionEl.querySelector('#tiles-container');

const createTile = () => {
  const tile = document.createElement('div');

  tile.classList.add('tile');
  tile.style.setProperty('--tile-opacity', Math.random());

  return tile;
};

const createTiles = (container, quantity) => {
  return Array.from(Array(quantity)).map(() => container.appendChild(createTile()));
};

const createGrid = (container) => {
  container.innerHTML = '';

  const { columns, rows } = getColumnsAndRows(container, TILE_SIZE_PX);

  container.style.setProperty('--tile-columns', columns);
  container.style.setProperty('--tile-rows', rows);

  createTiles(container, columns * rows);
};

const getColumnsAndRows = (container, tileSize) => {
  return {
    columns: Math.floor(container.clientWidth / tileSize) + 1,
    rows: Math.floor(container.clientHeight / tileSize) + 1,
  };
};

const changeOpacityOfTiles = (container) => {
  Array.from(container.querySelectorAll('.tile')).map((tile) =>
    tile.style.setProperty('--tile-opacity', Math.random())
  );

  setTimeout(() => changeOpacityOfTiles(container), BLINK_INTERVAL_MS);
};

window.addEventListener('load', () => createGrid(tilesContainer));
window.addEventListener('resize', () => createGrid(tilesContainer));

changeOpacityOfTiles(tilesContainer);
