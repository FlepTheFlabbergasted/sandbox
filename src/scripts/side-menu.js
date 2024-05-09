// Most of code from https://www.youtube.com/watch?v=bAwEj_mSzOs&ab_channel=Hyperplexed

const TILE_HEIGHT_PX = 42;

const section = document.getElementById('side-menu');
const menu = section.getElementsByClassName('menu')[0];
const topIcons = ['fa-solid fa-music fa-lg', 'fa-solid fa-code fa-lg'];
const bottomIcons = ['fa-regular fa-circle-user fa-lg', 'fa-solid fa-gear fa-lg'];

const polygonSpeaker = 'polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 200%, 200% 200%, 200% -100%, 100% -100%)'; // "speaker" shape
// const polygonSpeaker = 'polygon(0% 1%, 100% 1%, 100% 200%, 200% 200%, 200% -200%, 100% -200%, 100% 99%, 0% 99%)'; // "speaker" shape with -1% top n bot to prevent bleeding of box shadow
const polygonSquareTop = 'polygon(0% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 200%, 200% 200%, 200% -100%, 0% -100%)'; // "square" with 1/4 removed on top left
const polygonSquareBot = 'polygon(100% 0%, 0% 0%, 0% 100%, 0% 100%, 0% 200%, 200% 200%, 200% -100%, 100% -100%)'; // "square" with 1/4 removed on bot left

const createTile = (nrRows, index) => {
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.setAttribute('data-tile-index', index);
  //   tile.innerHTML = 'test';

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

document.body.onload = () => createTiles();
window.onresize = () => createTiles();
