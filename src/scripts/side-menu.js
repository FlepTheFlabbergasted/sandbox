// Tile code from https://www.youtube.com/watch?v=bAwEj_mSzOs&ab_channel=Hyperplexed

const TILE_HEIGHT_PX = 42;
const TILE_CSS_CLASS = 'tile';
const TILE_ACTIVE_CSS_CLASS = 'active-tile';
const TILE_ACTIVE_ABOVE_CSS_CLASS = 'active-tile-above';
const TILE_ACTIVE_BELOW_CSS_CLASS = 'active-tile-below';
const TILE_DATA_INDEX_ATTR = 'data-tile-index';

const CSS_VAR_TILE_ROWS = '--side-menu-rows';
const CURSOR_POINTER_CSS_CLASS = 'cursor-pointer';

const TOP_ICONS = ['fa-solid fa-music fa-lg', 'fa-solid fa-code fa-lg'];
const BOTTOM_ICONS = ['fa-regular fa-circle-user fa-lg', 'fa-solid fa-gear fa-lg'];

const sectionEl = document.getElementById('side-menu');
const menuEl = sectionEl.getElementsByClassName('menu')[0];

const createIconHtml = (iconClasses) => {
  return `<i class="${iconClasses}"></i>`;
};

const createTile = (index) => {
  const tile = document.createElement('div');
  tile.classList.add(TILE_CSS_CLASS);
  tile.setAttribute(TILE_DATA_INDEX_ATTR, index);

  return tile;
};

const addEventListenerToTile = (tile, index, nrRows) => {
  tile.addEventListener('click', () => {
    if (tile.classList.contains(TILE_ACTIVE_CSS_CLASS)) {
      tile.classList.remove(TILE_ACTIVE_CSS_CLASS);
      if (index < nrRows - 1) {
        menuEl
          .querySelector(`.${TILE_CSS_CLASS}[${TILE_DATA_INDEX_ATTR}='${index + 1}']`)
          .classList.remove(TILE_ACTIVE_ABOVE_CSS_CLASS);
      }

      if (index > 0) {
        menuEl
          .querySelector(`.${TILE_CSS_CLASS}[${TILE_DATA_INDEX_ATTR}='${index - 1}']`)
          .classList.remove(TILE_ACTIVE_BELOW_CSS_CLASS);
      }
    } else {
      menuEl
        .querySelectorAll(`.${TILE_CSS_CLASS}`)
        .forEach((tile) =>
          tile.classList.remove(TILE_ACTIVE_CSS_CLASS, TILE_ACTIVE_ABOVE_CSS_CLASS, TILE_ACTIVE_BELOW_CSS_CLASS)
        );

      tile.classList.add(TILE_ACTIVE_CSS_CLASS);

      if (index < nrRows - 1) {
        menuEl
          .querySelector(`.${TILE_CSS_CLASS}[${TILE_DATA_INDEX_ATTR}='${index + 1}']`)
          .classList.add(TILE_ACTIVE_ABOVE_CSS_CLASS);
      }

      if (index > 0) {
        menuEl
          .querySelector(`.${TILE_CSS_CLASS}[${TILE_DATA_INDEX_ATTR}='${index - 1}']`)
          .classList.add(TILE_ACTIVE_BELOW_CSS_CLASS);
      }
    }
  });
};

const createTiles = () => {
  let nrRows = Math.ceil(sectionEl.clientHeight / TILE_HEIGHT_PX);
  let tiles = Array.from(Array(nrRows)).map((_, index) => createTile(index));
  let bottomIconsCopy = [...BOTTOM_ICONS];

  menuEl.innerHTML = '';
  menuEl.style.setProperty(CSS_VAR_TILE_ROWS, nrRows);

  for (let i = 0; i < tiles.length; i++) {
    if (TOP_ICONS[i]) {
      tiles[i + 1].innerHTML = createIconHtml(TOP_ICONS[i]);
      tiles[i + 1].classList.add(CURSOR_POINTER_CSS_CLASS);
      addEventListenerToTile(tiles[i + 1], i + 1, nrRows);
    }

    if (i + 1 === tiles.length - bottomIconsCopy.length && bottomIconsCopy.length) {
      tiles[i].innerHTML = createIconHtml(bottomIconsCopy[0]);
      tiles[i].classList.add(CURSOR_POINTER_CSS_CLASS);
      bottomIconsCopy.shift();
      addEventListenerToTile(tiles[i], i, nrRows);
    }

    menuEl.appendChild(tiles[i]);
  }
};

window.addEventListener('load', () => createTiles());
window.onresize = () => createTiles();
