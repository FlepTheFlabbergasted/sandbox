const sectionEl = document.getElementById('text-shape-highlight');
const textContainer = sectionEl.querySelector('#text-container');

const INITIAL_NR_CHARS = 500;
const DRAW_SHAPE = `
- - - - -
- - - - -
- -
- - -
- - -
- -
- -`;

/**
 * Requires the line-height CSS attribute to be set to a number value
 * E.g. 'line-height' can't be set to 'normal'
 */
const getPropertyValue = (element, property) => {
  let propertyStr = window.getComputedStyle(element).getPropertyValue(property);
  console.log(`${property}: ${propertyStr}`);
  return parseFloat(propertyStr);
};

const getRandomChars = (length) => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#¤%&/()=?`@£$€{[]}\\^-_,;.:§½';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

function wrap(str, startIndex, endIndex, startStr, endStr) {
  return (
    str.substring(0, startIndex) + startStr + str.substring(startIndex, endIndex) + endStr + str.substring(endIndex)
  );
}
function replaceAt(str, index, replacement) {
  return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

window.addEventListener('load', () => {
  const randomSymbols = getRandomChars(INITIAL_NR_CHARS);
  textContainer.innerHTML = wrap(randomSymbols, 4, 10, '<span class="highlighted">', '</span>');

  const fontSize = getPropertyValue(textContainer, 'font-size');
  const lineHeight = Math.floor(getPropertyValue(textContainer, 'line-height'));

  const { width, height } = textContainer.getBoundingClientRect();
  const nrColumns = Math.floor(width / fontSize);
  const nrRows = Math.floor(height / lineHeight);

  const howManyCharsIsLeftToFillTheLastLine = INITIAL_NR_CHARS - nrColumns * nrRows;

  console.log({ fontSize, lineHeight, nrColumns, nrRows });
  console.log({ howManyCharsShouldBeAbleToFitOnOneLine: howManyCharsIsLeftToFillTheLastLine });
});

window.addEventListener('resize', () => {
  console.log(`resize`);
});
