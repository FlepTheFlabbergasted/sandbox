const CSS_CLASS_TILE = 'tile';
const CSS_CLASS_ICON_TILE = 'icon-tile';
const CSS_CLASS_ACTIVE_TILE = 'active-tile';
const CSS_CLASS_ACTIVE_TILE_ABOVE = 'active-tile-above';
const CSS_CLASS_ACTIVE_TILE_BELOW = 'active-tile-below';

const DATA_ATTR_TILE_INDEX = 'data-tile-index';
const DATA_ATTR_CONTENT_INDEX = 'data-content-index';

const sectionEl = document.getElementById('side-menu');
const menuEl = sectionEl.getElementsByClassName('menu')[0];
const contentContainerEl = sectionEl.querySelector('.content-container');
const contentEl = contentContainerEl.querySelector('#content');

const setDataTileIndexes = () => {
  Array.from(menuEl.getElementsByClassName(CSS_CLASS_TILE)).forEach((tile, index) =>
    tile.setAttribute(DATA_ATTR_TILE_INDEX, index)
  );
};

const clearActiveTileCssClasses = () => {
  menuEl
    .querySelectorAll(`.${CSS_CLASS_TILE}`)
    .forEach((tile) =>
      tile.classList.remove(CSS_CLASS_ACTIVE_TILE, CSS_CLASS_ACTIVE_TILE_ABOVE, CSS_CLASS_ACTIVE_TILE_BELOW)
    );
};

const setTileCssClass = (iconTileDataIndex, cssClass) => {
  menuEl.querySelector(`.${CSS_CLASS_TILE}[${DATA_ATTR_TILE_INDEX}='${iconTileDataIndex}']`).classList.add(cssClass);
};

const removeTileCssClass = (iconTileDataIndex, cssClass) => {
  menuEl.querySelector(`.${CSS_CLASS_TILE}[${DATA_ATTR_TILE_INDEX}='${iconTileDataIndex}']`).classList.remove(cssClass);
};

const addEventListenerToIconTiles = () => {
  const contentDivs = Array.from(contentContainerEl.querySelectorAll('h1'));

  Array.from(menuEl.getElementsByClassName(CSS_CLASS_ICON_TILE)).forEach((iconTile, index) => {
    const iconTileDataIndex = Number(iconTile.getAttribute(DATA_ATTR_TILE_INDEX));

    iconTile.addEventListener('click', () => {
      if (iconTile.classList.contains(CSS_CLASS_ACTIVE_TILE)) {
        iconTile.classList.remove(CSS_CLASS_ACTIVE_TILE);
        removeTileCssClass(iconTileDataIndex + 1, CSS_CLASS_ACTIVE_TILE_ABOVE);
        removeTileCssClass(iconTileDataIndex - 1, CSS_CLASS_ACTIVE_TILE_BELOW);
      } else {
        clearActiveTileCssClasses();
        iconTile.classList.add(CSS_CLASS_ACTIVE_TILE);
        setTileCssClass(iconTileDataIndex + 1, CSS_CLASS_ACTIVE_TILE_ABOVE);
        setTileCssClass(iconTileDataIndex - 1, CSS_CLASS_ACTIVE_TILE_BELOW);

        // Just to spice up the content showing
        contentEl.innerHTML = '';
        contentEl.classList.remove('power-up');
        contentEl.innerHTML = contentDivs[index].outerHTML;
        setTimeout(() => contentEl.classList.add('power-up'), 0);
      }
    });
  });
};

window.addEventListener('load', () => {
  setDataTileIndexes();
  addEventListenerToIconTiles();
});
