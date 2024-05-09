// Tile code from https://www.youtube.com/watch?v=bAwEj_mSzOs&ab_channel=Hyperplexed

const TILE_HEIGHT_PX = 42;

const section = document.getElementById('side-menu');
const menu = section.getElementsByClassName('menu')[0];
const topIcons = ['fa-solid fa-music fa-lg', 'fa-solid fa-code fa-lg'];
const bottomIcons = ['fa-regular fa-circle-user fa-lg', 'fa-solid fa-gear fa-lg'];

const createTile = (nrRows, index) => {
  const tile = document.createElement('div');
  tile.classList.add('tile', 'polygon-speaker');
  tile.setAttribute('data-tile-index', index);
  //   tile.innerHTML = 'test';

  tile.addEventListener('mouseover', () => {
    if (index > 0) {
      menu
        .querySelector(`.tile[data-tile-index='${index - 1}']`)
        .classList.replace('polygon-speaker', 'polygon-square-bot');
    }

    if (index < nrRows - 1) {
      menu
        .querySelector(`.tile[data-tile-index='${index + 1}']`)
        .classList.replace('polygon-speaker', 'polygon-square-top');
    }
  });
  tile.addEventListener('mouseout', () => {
    if (index > 0) {
      menu
        .querySelector(`.tile[data-tile-index='${index - 1}']`)
        .classList.replace('polygon-square-bot', 'polygon-speaker');
    }

    if (index < nrRows - 1) {
      menu
        .querySelector(`.tile[data-tile-index='${index + 1}']`)
        .classList.replace('polygon-square-top', 'polygon-speaker');
    }
  });

  return tile;
};

const createTiles = () => {
  menu.innerHTML = '';
  let nrRows = Math.ceil(section.clientHeight / TILE_HEIGHT_PX);
  let tiles = Array.from(Array(nrRows)).map((_, index) => createTile(nrRows, index));
  let bottomIconsCopy = [...bottomIcons];

  menu.style.setProperty('--side-menu-rows', nrRows);

  for (let i = 0; i < tiles.length; i++) {
    if (topIcons[i]) {
      tiles[i + 1].innerHTML = `<i class="${topIcons[i]}"></i>`;
    }

    if (i + 1 === tiles.length - bottomIconsCopy.length) {
      tiles[i].innerHTML = `<i class="${bottomIconsCopy[0]}"></i>`;
      bottomIconsCopy.shift();
    }

    menu.appendChild(tiles[i]);
  }
};

window.addEventListener('load', () => createTiles());
window.onresize = () => createTiles();
