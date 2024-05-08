// Most of code from https://www.youtube.com/watch?v=bAwEj_mSzOs&ab_channel=Hyperplexed

const TILE_HEIGHT_PX = 42;

const section = document.getElementById('side-menu');
const menu = section.getElementsByClassName('menu')[0];

const polygonSpeaker = 'polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 200%, 200% 200%, 200% -100%, 100% -100%)'; // "speaker" shape
const polygonSquareTop = 'polygon(0% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 200%, 200% 200%, 200% -100%, 0% -100%)'; // "square" with 1/4 removed on top left
const polygonSquareBot = 'polygon(100% 0%, 0% 0%, 0% 100%, 0% 100%, 0% 200%, 200% 200%, 200% -100%, 100% -100%)'; // "square" with 1/4 removed on bot left

const createTile = (nrRows, index) => {
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.setAttribute('data-tile-index', index);
  tile.innerHTML = 'test';

  tile.addEventListener('mouseover', () => {
    if (index > 0) {
      menu.querySelector(`.tile[data-tile-index='${index - 1}']`).style.setProperty('clip-path', polygonSquareBot);
    }

    if (index < nrRows - 1) {
      menu.querySelector(`.tile[data-tile-index='${index + 1}']`).style.setProperty('clip-path', polygonSquareTop);
    }
  });
  tile.addEventListener('mouseout', () => {
    if (index > 0) {
      menu.querySelector(`.tile[data-tile-index='${index - 1}']`).style.setProperty('clip-path', polygonSpeaker);
    }

    if (index < nrRows - 1) {
      menu.querySelector(`.tile[data-tile-index='${index + 1}']`).style.setProperty('clip-path', polygonSpeaker);
    }
  });

  return tile;
};

const createTiles = (nrRows) => {
  return Array.from(Array(nrRows)).map((_, index) => {
    menu.appendChild(createTile(nrRows, index));
  });
};

const createGrid = () => {
  menu.innerHTML = '';
  let rows = Math.ceil(section.clientHeight / TILE_HEIGHT_PX);
  menu.style.setProperty('--side-menu-rows', rows);

  createTiles(rows);
};

window.onload = () => createGrid();
window.onresize = () => createGrid();
