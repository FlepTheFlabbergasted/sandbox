// Most of code from https://www.youtube.com/watch?v=bAwEj_mSzOs&ab_channel=Hyperplexed

const TILE_SIZE_PX = 42;

const section = document.getElementById('side-menu');
const menu = section.getElementsByClassName('menu')[0];

const createTile = () => {
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.innerHTML = 'test';

  //   tile.addEventListener('mouseover', () => {
  //     console.log('sdfdsf');
  //     tile.style.setProperty('clip-path', 'none');
  //   });
  //   tile.addEventListener('mouseout', () => {
  //     console.log('sdfdsf');
  //     tile.style.removeProperty('clip-path');
  //   });

  return tile;
};

const createTiles = (quantity) => {
  return Array.from(Array(quantity)).map((_, index) => {
    menu.appendChild(createTile(index));
  });
};

const createGrid = () => {
  menu.innerHTML = '';
  let rows = Math.ceil(section.clientHeight / TILE_SIZE_PX);
  menu.style.setProperty('--side-menu-rows', rows);

  createTiles(rows);
};

window.onload = () => createGrid();
window.onresize = () => createGrid();
