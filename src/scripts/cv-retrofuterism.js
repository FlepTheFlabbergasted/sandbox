import { getRandomInt } from './util/get-random-int.js';
import { Timer } from './util/timer.js';

const sectionEl = document.getElementById('cv-retrofuterism');
const mainConsoleEl = sectionEl.querySelector('#main-console');

const subjectDataContainerEl = sectionEl.querySelector('#subject-data-container');
const subjectDataConsoleEl = sectionEl.querySelector('#subject-data-console');

const systemContainerEl = sectionEl.querySelector('#system-container');
const systemConsoleEl = sectionEl.querySelector('#system-console');

const ANIM_TIME_PER_CHAR_MS = 10;
const TIME_BETWEEN_TEXT_BLOCKS_MIN_MS = 250; // 500
const TIME_BETWEEN_TEXT_BLOCKS_MAX_MS = 1000; // 2000

const EventTypes = {
  ShowCpuLoadAndRamUsage: 'ShowCpuLoadAndRamUsage',
  StartUptime: 'StartUptime',
  ShowSubjectInfo: 'ShowSubjectInfo',
};
const EVENTS_MAP = {
  [EventTypes.ShowCpuLoadAndRamUsage]: {
    name: EventTypes.ShowCpuLoadAndRamUsage,
    trigger: 'Checking system integrity',
    callBack: async () => {
      const SYSTEM_TEXT = [['CPU LOAD: <span id="cpu-load"></span>%', 'RAM USAGE: <span id="ram-usage"></span>%', '']];
      systemContainerEl.style.setProperty('visibility', 'visible');
      await timeout(1000);
      appendTextBlocks(systemConsoleEl, SYSTEM_TEXT);
    },
  },
  [EventTypes.StartUptime]: {
    name: EventTypes.StartUptime,
    trigger: 'All systems online',
    callBack: async () => {
      const timer = new Timer();
      timer.start();
      setInterval(() => {
        const { hours, minutes, seconds } = timer.getTime();
        const secondsStr = seconds.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const hoursStr = hours.toString().padStart(2, '0');
        const formattedTime = `${hoursStr}:${minutesStr}:${secondsStr}`;

        const uptimeEl = sectionEl.querySelector('#uptime');
        if (uptimeEl) {
          uptimeEl.innerText = formattedTime;
        }
      }, 1000);
      const UPTIME_TEXT = [['UPTIME: <span id="uptime">00:00:00</span>', '']];
      appendTextBlocks(systemConsoleEl, UPTIME_TEXT);
    },
  },
  [EventTypes.ShowSubjectInfo]: {
    name: EventTypes.ShowSubjectInfo,
    trigger: 'Optimal subject found',
    callBack: async () => {
      const SUBJECT_DATA_TEXT = [
        [
          'Name: Filip Strandberg',
          'Age: 31',
          '',
          'Profession: Lead frontend dev',
          'Residence: Sweden',
          '',
          'Email: email@gmail.com',
          'Phone: (+46)12 345 7890',
          '',
          'GitHub: <a target="_blank" href="https://github.com/FlepTheFlabbergasted">FlepTheFlabbergasted</a>',
          'LinkedIn: <a target="_blank" href="https://www.linkedin.com/in/filip-strandberg/">Filip Strandberg</a>',
        ],
      ];
      subjectDataContainerEl.style.setProperty('visibility', 'visible');
      await timeout(1000);
      appendTextBlocks(subjectDataConsoleEl, SUBJECT_DATA_TEXT);
    },
  },
};

const PROMPT = 'fstrand_mainframe:~>&nbsp;<span contenteditable="plaintext-only"></span>';

export const STARTUP_TEXT_BLOCKS = [
  ['FSTRAN AG-31 Systems, BIOs v2.7', ''],
  [
    'CPU: Flep XR-3250, 2 Cores, 150MHz',
    'MEM: FFMeP 500 KB Double-Channel DDR2 RAM, 920 MHz',
    'Storage: 25 MB Floppy 4 MB Free',
    '',
  ],
  [
    EVENTS_MAP[EventTypes.ShowCpuLoadAndRamUsage].trigger,
    '  Core processor status ............ OK',
    '  Communications array ............. OK',
    '  Power distribution network ....... OK',
    '',
    'System hardware checks complete',
    '',
  ],
  [
    'Data storage and network systems',
    '  Data storage modules ............. OK',
    '  Network connection status ........ OK',
    '  Data encryption system ........... OK',
    '',
    'Data and network checks complete',
    '',
    EVENTS_MAP[EventTypes.StartUptime].trigger,
    '',
  ],
  ['Initiating network modules...'],
  ['Starting network scan...'],
  ['Searching for suitable subject...', ''],
  [
    EVENTS_MAP[EventTypes.ShowSubjectInfo].trigger,
    '',
    '  STRANDBERG, FILIP',
    '  Lead Frontend Developer',
    '  Builder of systems. Breaker of bugs',
    '',
  ],
  ["Type 'help' to explore available modules.", ''],
];

export const COMMANDS = [
  {
    name: 'help',
    aliases: ['menu', 'ls'],
    response: [
      [
        '',
        'Available modules:',
        '',
        '> employment',
        '> education',
        '> skills',
        '> freetime',
        '> about',
        '',
        'Type a command to continue',
        '',
      ],
    ],
  },
  {
    name: 'employment',
    aliases: ['work', 'experience'],
    response: [
      [
        '',
        'Accessing employment archive...',
        '',
        '> hyph',
        '> swedbank',
        '> tieto',
        '',
        "Run 'open &lt;company>' to inspect a record",
        '',
      ],
    ],
  },
  {
    name: 'education',
    aliases: ['studies'],
    response: [
      ['', 'Loading academic records...', '', '> bachelors', '> thesis', '', "Run 'open &lt;record>' to inspect", ''],
    ],
  },
  {
    name: 'skills',
    aliases: [],
    response: [
      [
        '',
        'Decrypting skill matrix...',
        '',
        '> languages',
        '> frameworks',
        '> testing',
        '> devops',
        '> cloud',
        '> design',
        '',
        "Run 'open &lt;category>' to expand",
        '',
      ],
    ],
  },
  {
    name: 'freetime',
    aliases: ['extracurricular'],
    response: [
      [
        '',
        'Loading extracurricular modules...',
        '',
        '> theater.exe',
        '> creative_collab.sys',
        '> absurd_humor.dll',
        '',
        'Because engineers contain multitudes',
        '',
      ],
    ],
  },
  {
    name: 'about',
    aliases: ['whoami'],
    response: [
      [
        '',
        'Querying personality core...',
        '',
        'Problem solver.',
        'Systems thinker.',
        'Calm under pressure.',
        'Curious by default.',
        '',
        'Currently building the future, one deploy at a time',
        '',
      ],
    ],
  },
  {
    name: 'contact',
    aliases: ['ping', 'connect'],
    response: [
      [
        '',
        'Opening communication channels...',
        '',
        'LinkedIn: <your-link>',
        'GitHub: <your-link>',
        'Email: <your-email>',
        '',
        'Awaiting transmission',
        '',
      ],
    ],
  },
  {
    name: 'sudo hire filip',
    aliases: ['hire'],
    response: [
      [
        '',
        'Permission granted.',
        '',
        'Welcome aboard.',
        'Initiating legendary mode...',
        '',
        'Productivity boost: +300%',
        '',
      ],
    ],
  },
  {
    name: 'coffee --boost',
    aliases: ['coffee'],
    response: [
      [
        '',
        'Injecting caffeine...',
        '',
        'Focus increased.',
        'Debugging speed improved.',
        '',
        'Warning: May refactor entire codebase.',
        '',
      ],
    ],
  },
  {
    name: 'konami',
    aliases: [],
    response: [['', '↑ ↑ ↓ ↓ ← → ← → B A', '', '🚀 RETROFUTURE MODE ACTIVATED', '', 'Neon levels: MAXIMUM', '']],
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

    const event = Object.values(EVENTS_MAP).find((event) => event.trigger === text);

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

const printPrompt = async (container) => {
  const animTime = 20 * ANIM_TIME_PER_CHAR_MS;
  const promptDiv = createConsoleTextDiv(PROMPT, animTime);

  promptDiv.classList.add('prompt');
  container.appendChild(promptDiv);

  const writingSpan = promptDiv.querySelector('span');
  writingSpan.addEventListener('keydown', (event) => onPromptKeyDownEventFn(event, container, writingSpan));

  await timeout(animTime);
  writingSpan.focus();
};

const completePrompt = (element) => {
  element.setAttribute('contenteditable', false);
  element.removeEventListener('keydown', onPromptKeyDownEventFn);
};

const onPromptKeyDownEventFn = async (event, container, element) => {
  switch (event.key) {
    case 'Enter':
      event.preventDefault();
      // TODO: Add to history
      const text = element.innerText;

      if (!text) {
        completePrompt(element);
        printPrompt(container);
        return;
      }

      console.log('You wrote: ', text);
      completePrompt(element);

      const command = COMMANDS.find(
        (command) => command.name === text || command.aliases.find((alias) => alias === text)
      );

      if (command) {
        completePrompt(element);
        await appendTextBlocks(mainConsoleEl, command.response);
        printPrompt(container);
      } else {
        completePrompt(element);
        await appendTextBlocks(mainConsoleEl, [['', `Unknown command '${text}'`, '']]);
        printPrompt(container);
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      // TODO: History back
      break;
    case 'ArrowDown':
      event.preventDefault();
      // TODO: History forward
      break;
  }
};

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const scrollToBottomOfContainer = (container) => {
  container.scrollTop = container.scrollHeight - container.clientHeight;
};

const registerEvents = (eventsMap) => {
  Object.values(eventsMap).forEach((event) => {
    window.addEventListener(event.name, event.callBack);
  });
};

window.addEventListener('load', async () => {
  const observer = new MutationObserver(() => scrollToBottomOfContainer(mainConsoleEl));
  observer.observe(mainConsoleEl, { childList: true });

  registerEvents(EVENTS_MAP);

  mainConsoleEl.addEventListener('click', (event) => {
    event.stopPropagation();

    if (!window.getSelection()?.toString()) {
      const writingSpan = mainConsoleEl.querySelector('span[contenteditable="plaintext-only"]');
      writingSpan?.focus();
    }
  });

  await appendTextBlocks(mainConsoleEl, STARTUP_TEXT_BLOCKS);

  printPrompt(mainConsoleEl);
});
