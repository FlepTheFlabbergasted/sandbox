import { getRandomInt } from './util/get-random-int.js';

const sectionEl = document.getElementById('cv-retrofuterism');
const consoleDiv = sectionEl.querySelector('#console');

const ANIM_TIME_PER_CHAR_MS = 10;
const TIME_BETWEEN_TEXT_BLOCKS_MIN_MS = 500;
const TIME_BETWEEN_TEXT_BLOCKS_MAX_MS = 2000;

const EventTypes = {
  SatDataLinkUp: 'sat-data-link-up',
};
const EVENT_TRIGGER_SAT_DATA_LINK_UP_STR = '   Connection status: Secure';
const EVENTS = [
  {
    name: EventTypes.SatDataLinkUp,
    trigger: EVENT_TRIGGER_SAT_DATA_LINK_UP_STR,
    callBack: () => {
      console.log('TRIGGERED');
    },
  },
];

const PROMPT = 'fstrand_mainframe:~> <span contenteditable="plaintext-only">';

export const STARTUP_TEXT_BLOCKS = [
  ['FSTRAN AG-31 Systems, BIOs v2.7', ''],
  [
    'CPU: Flep Qbit-42 XR-3250, 128 Cores, 4.20GHz',
    'MEM: FFMeP 1337 GB Quasi-Channel DDR64 RAM, 3200 GHz',
    'Storage: 21 PB M2-SSD, 69 PB Free',
    '',
  ],
  // [
  //   'Checking system integrity',
  //   '  Core processor status ............ OK',
  //   '  Communications array ............. OK',
  //   '  Power distribution network ....... OK',
  //   '',
  //   'System hardware checks complete',
  //   EVENT_TRIGGER_SAT_DATA_LINK_UP_STR,
  //   '',
  // ],
  // [
  //   'Data storage and network systems',
  //   '  Data storage modules ............. OK',
  //   '  Network connection status ........ OK',
  //   '  Data encryption system ........... OK',
  //   '',
  //   'Data and network checks complete',
  //   '',
  //   'All systems online',
  //   '',
  // ],
  // ['Initiating network modules...'],
  // ['Starting network scan...'],
  // ['Searching for suitable subject...', ''],
  // [
  //   'Optimal subject found',
  //   '',
  //   '  STRANDBERG, FILIP',
  //   '  Lead Frontend Developer',
  //   '  Builder of systems. Breaker of bugs',
  //   '',
  // ],
  // ['', "Type 'help' to explore available modules.", ''],
];

export const commands = [
  {
    command: 'help',
    aliases: ['menu', 'ls'],
    response: [
      'Available modules:',
      '',
      '> employment',
      '> education',
      '> skills',
      '> freetime',
      '> about',
      '',
      'Type a command to continue.',
    ],
  },
  {
    command: 'employment',
    aliases: ['work', 'experience'],
    response: [
      'Accessing employment archive...',
      '',
      '> hyph',
      '> swedbank',
      '> tieto',
      '',
      "Run 'open <company>' to inspect a record.",
    ],
  },
  {
    command: 'education',
    aliases: ['studies'],
    response: ['Loading academic records...', '', '> bachelors', '> thesis', '', "Run 'open <record>' to inspect."],
  },
  {
    command: 'skills',
    aliases: [],
    response: [
      'Decrypting skill matrix...',
      '',
      '> languages',
      '> frameworks',
      '> testing',
      '> devops',
      '> cloud',
      '> design',
      '',
      "Run 'open <category>' to expand.",
    ],
  },
  {
    command: 'freetime',
    aliases: ['extracurricular'],
    response: [
      'Loading extracurricular modules...',
      '',
      '> theater.exe',
      '> creative_collab.sys',
      '> absurd_humor.dll',
      '',
      'Because engineers contain multitudes.',
    ],
  },
  {
    command: 'about',
    aliases: ['whoami'],
    response: [
      'Querying personality core...',
      '',
      'Problem solver.',
      'Systems thinker.',
      'Calm under pressure.',
      'Curious by default.',
      '',
      'Currently building the future, one deploy at a time.',
    ],
  },
  {
    command: 'contact',
    aliases: ['ping', 'connect'],
    response: [
      'Opening communication channels...',
      '',
      'LinkedIn: <your-link>',
      'GitHub: <your-link>',
      'Email: <your-email>',
      '',
      'Awaiting transmission.',
    ],
  },
  {
    command: 'sudo hire filip',
    aliases: ['hire'],
    response: [
      'Permission granted.',
      '',
      'Welcome aboard.',
      'Initiating legendary mode...',
      '',
      'Productivity boost: +300%',
    ],
  },
  {
    command: 'coffee --boost',
    aliases: ['coffee'],
    response: [
      'Injecting caffeine...',
      '',
      'Focus increased.',
      'Debugging speed improved.',
      '',
      'Warning: May refactor entire codebase.',
    ],
  },
  {
    command: 'konami',
    aliases: [],
    response: ['↑ ↑ ↓ ↓ ← → ← → B A', '', '🚀 RETROFUTURE MODE ACTIVATED', '', 'Neon levels: MAXIMUM'],
  },
];

const createConsoleTextDiv = (text, animTime) => {
  const divEl = document.createElement('div');

  divEl.classList.add('console-text');
  divEl.style.setProperty('--nr-chars', text.length);
  divEl.style.setProperty('--anim-time', animTime);
  divEl.innerHTML = text;

  return divEl;
};

const appendTextRows = async (container, textRows) => {
  for (let i = 0; i < textRows.length; i++) {
    const text = textRows[i];
    const animTime = textRows[i].length * ANIM_TIME_PER_CHAR_MS;
    container.appendChild(createConsoleTextDiv(text, animTime));

    await timeout(animTime);

    const event = EVENTS.find((event) => event.trigger === text);
    if (event) {
      window.dispatchEvent(new Event(event.name));
    }
  }
};

const appendTextBlocks = async (container, textBlocks) => {
  for (let i = 0; i < textBlocks.length; i++) {
    await appendTextRows(container, textBlocks[i]);
    await timeout(getRandomInt(TIME_BETWEEN_TEXT_BLOCKS_MIN_MS, TIME_BETWEEN_TEXT_BLOCKS_MAX_MS));
  }
};

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const scrollToBottomOfContainer = (container) => {
  container.scrollTop = container.scrollHeight - container.clientHeight;
};

const registerEvents = (events) => {
  events.forEach((event) => {
    window.addEventListener(event.name, event.callBack);
  });
};

window.addEventListener('load', async () => {
  const observer = new MutationObserver(() => scrollToBottomOfContainer(consoleDiv));
  observer.observe(consoleDiv, { childList: true });

  registerEvents(EVENTS);

  await appendTextBlocks(consoleDiv, STARTUP_TEXT_BLOCKS);

  const promptDiv = createConsoleTextDiv(PROMPT, 0);
  promptDiv.classList.add('prompt');
  consoleDiv.appendChild(promptDiv);
  const writingSpan = promptDiv.querySelector('span');
  writingSpan.focus();
  writingSpan.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('You wrote: ', writingSpan.innerHTML);
    }
  });
});
