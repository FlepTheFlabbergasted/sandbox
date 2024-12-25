import { getRandomInt } from '../../util/get-random-int';

const sectionEl = document.getElementById('retrofuturism');
const consoleDiv = sectionEl.querySelector('#console');

const CODE_BLOCKS = [
  [
    'struct group_info',
    'init_groups = { .usage = ATOMIC_INIT(2) };',
    'struct group_info',
    '*groups_alloc(int gidsetsize) {',
    'struct group_info',
    '*group_info;',
    '',
    'int nblocks;',
    '',
    'int i;',
  ],
  [
    'struct group_info',
    'init_groups = { .usage = ATOMIC_INIT(2) };',
    'struct group_info',
    '*groups_alloc(int gidsetsize) {',
    'struct group_info',
    '*group_info;',
    '',
    'int nblocks;',
    '',
    'int i;',
  ],
];
const ANIM_TIME_PER_CHAR_MS = 20;

const createSpanEl = (content, animTime) => {
  const divEl = document.createElement('div');

  divEl.classList.add('console-code');
  divEl.style.setProperty('--nr-chars', content.length);
  divEl.style.setProperty('--anim-time', animTime);
  divEl.innerHTML = content;

  return divEl;
};

const appendCodeRows = async (codeRows, completeCallbackFn) => {
  if (!codeRows.length) {
    completeCallbackFn();
    return;
  }

  const content = codeRows[0];
  const animTime = codeRows[0].length * ANIM_TIME_PER_CHAR_MS;
  consoleDiv.appendChild(createSpanEl(content, animTime));

  await timeout(animTime);
  appendCodeRows(codeRows.slice(1), completeCallbackFn);
};

const appendCodeBlocks = async (codeBlocks) => {
  if (!codeBlocks.length) {
    return;
  }

  await new Promise((resolveFn) => appendCodeRows(codeBlocks[0], resolveFn));
  await timeout(getRandomInt(500, 2000));

  // Blank row between blocks if this is not the last block
  if (codeBlocks.length - 1 > 0) {
    await new Promise((resolveFn) => appendCodeRows([''], resolveFn));
  }

  appendCodeBlocks(codeBlocks.slice(1));
};

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

window.addEventListener('load', () => {
  appendCodeBlocks(CODE_BLOCKS);
});
