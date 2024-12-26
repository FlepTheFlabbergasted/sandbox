import { getRandomInt } from '../../util/get-random-int';

const sectionEl = document.getElementById('retrofuturism');
const consoleDiv = sectionEl.querySelector('#console');
const textContainerDiv = consoleDiv.querySelector('.text-container');

const ANIM_TIME_PER_CHAR_MS = 10;
const TIME_BETWEEN_TEXT_BLOCKS_MIN_MS = 500;
const TIME_BETWEEN_TEXT_BLOCKS_MAX_MS = 2000;
// prettier-ignore
const TEXT_BLOCKS = [
  [
    'Starship Command Terminal v2.7',
    'Primary Systems Boot Sequence Initiated'
  ],
  [
    'Checking system integrity',
    '  Core processor status ............OK',
    '  Navigation module ................OK',
    '  Life support systems .............OK',
    '  FTL drive array ..................OK',
    '  Communications array .............OK',
    '  Power distribution network .......OK',
    '  Sensor grid ......................OK',
    '  Hull integrity ...................OK',
    '  Crew status monitors .............OK',
    '  Data storage modules .............OK',
    '',
    'All systems online'
  ],
  [
    'Initializing data transfer modules',
    '  Starting transmission handler ............OK',
    '  Starting encryption engine ...............OK',
    '  Starting packet routing system ...........OK',
    '  Starting data compression module .........OK',
    '  Starting file integrity checker ..........OK',
    '  Starting logging system ..................OK',
    '',
    'All data transfer modules ready',
  ],
  [
    'Initiating network modules ...OK'
  ],
  [
    'Starting network scan...',
    'Searching for available resources...',
  ],
  [
    'Resources detected',
    '  PGID       PR   NI  VIRT    S   %CPU  %MEM  TIME+',
    '  BRT-743-Y  36   19  36280   Y   7.3   6.9   0:21.50',
    '  UJW-936-H  72   0   33216   N   0.5   1.2   2:41.11',
    '  JQP-385-I  20   4   14304   N   0.1   66.3  0:05.19',
    '  JMC-037-A  20   0   13448   Y   15.1  23.1  1:13.53',
    '  LBW-910-N  63   3   8136    N   4.9   0.9   1:37.03',
    '  QWH-575-S  45   0   8136    N   0.8   33.1  0:41.57'
  ],
  [
    'Selecting target node: JMC-037-A',
    'Attempting to connect to node ...OK',
    'Initiating handshake...',
    'JMC-037-A node response received ...OK',
    '   Authentication accepted',
    '   Encryption link established (Protocol: Crystal Lock v3.1)',
    '   Connection status: Secure'
  ],
  [
    'Checking node status...',
    'Running system diagnostic...',
    '',
    'JMC-037-A node system processes',
    'User       PID    %CPU  %MEM     VSZ    RSS    STAT  TIME     Command',
    'root       001    0.1   0.2     6428   1184   Ss    0:00     /system/init_core',
    'admin      135    2.3   4.1     11234  4528   Sl    5:12     /data/processing_unit',
    'research   212    15.7  10.6    452334 54208  S     32:43    /ai/research_module',
    'research   213    12.4  9.8     390284 49128  S     28:45    /ai/research_module',
    'comm       310    5.2   3.3     19842  9820   Ss    12:21    /comm/transmitter',
    'root       411    0.1   0.2     8348   1120   Ss    0:03     /system/log_handler',
    'root       521    0.0   0.1     6432   928    S     0:01     /system/monitor_agent'
  ],
  [
    'Beginning data transfer...',
    'Uploading mining data...',
    '  File                                 SIZE MB   STATUS',
    '  MINING_LOG_2024_01.DAT               54.3      [Uploaded ...OK]',
    '  MINERAL_ANALYSIS_XI.DAT              82.1      [Uploaded ...OK]',
    '  EXTRATERRESTRIAL_GEOLOGY_2024.DAT    91.7      [Uploaded ...OK]',
    '  LUNAR_SURFACE_PRESSURE_DYNAMICS.DAT  67.5      [Uploaded ...OK]',
    '  ORE_COMPOSITION_ETA-9.DAT            134.3     [Uploaded ...OK]',
    '  ASTEROID_MINE_SITE_12-17-2024.DAT    113.8     [Uploaded ...OK]',
    '',
    'Data upload complete ...OK',
    '',
    'Confirming receipt with JMC-037-A node ...OK',
    '  Status: Files successfully received ...OK'
  ],
  [
    'Retrieving mining project status from JMC-037-A node ...OK',
    ' Metric                                  Value                     ',
    ' OE (Operational Efficiency)             83.4%                     ',
    ' MPM (Mining Performance Metrics)        142.7 tons/day            ',
    ' ROR (Remaining Ore Reserves)            1,246,500 tons            ',
    ' LST (Lunar Surface Temperature)         -45.2°C (Stable)          ',
    ' SP (Surface Pressure)                   100.2 kPa (Nominal)       ',
    ' DSE (Drill System Efficiency)           98.7%                     ',
    ' DCT (Drill Core Temperature)            190.3°C (Critical)        ',
    ' AOL (Atmospheric Oxygen Levels)         99.8% (Optimal)           ',
    ' WER (Water Extraction Rate)             75.2 L/hr                 ',
    ' PC (Power Consumption)                  78.3% (ER: 14.7%)         ',
    ' PMS (Power Module Status)               Critical load threshold   ',
    ' HSE (Hydroponics System Efficiency)     91.2%                     ',
    ' CAP (Current Air Pressure)              100.2 kPa (Normal)        ',
    ' SA (Seismic Activity)                   None                      ',
    ' LDTE (Last Data Transmission to Earth)  04:12 hours ago           ',
    ' LRC (Lunar Regolith Composition)        12.3% Fe, 8.9% Si, 4.5% Mg',
    ' TER (Total Extracted Resources)         45,231 tons (84%)         ',
    ' USM (Upcoming Scheduled Maintenance)    23 hrs                    ',
    ' OQA (Ore Quality Analysis)              Grade A                   ',
    ' LGR (Lunar Geo-Physics Reading)         Magnetic anomalies at 10m ',
    ' DCES (Deep Core Extraction Status)      350m (92.3% complete)     ',
    ' OEZ (Ore Extraction Zones)              12 zones (Optimized)      ',
    ' NRC (Next Recalibration Cycle)          6 hrs                     ',
  ],
  [
    'Terminating connection...',
    'Disconnecting from node JMC-037-A ...OK',
    'Closing encryption channel ...OK',
    '',
    'Connection terminated successfully'
  ],
  [
    'Returning to idle mode ...OK',
    'Engaging system standby ...OK'
  ]
];

const createSpanEl = (content, animTime) => {
  const divEl = document.createElement('div');

  divEl.classList.add('console-text');
  divEl.style.setProperty('--nr-chars', content.length);
  divEl.style.setProperty('--anim-time', animTime);
  divEl.innerHTML = content;

  return divEl;
};

const appendTextRows = async (textRows, completeCallbackFn) => {
  if (!textRows.length) {
    completeCallbackFn();
    return;
  }

  const content = textRows[0];
  const animTime = textRows[0].length * ANIM_TIME_PER_CHAR_MS;
  textContainerDiv.appendChild(createSpanEl(content, animTime));

  await timeout(animTime);
  appendTextRows(textRows.slice(1), completeCallbackFn);
};

const appendTextBlocks = async (textBlocks) => {
  if (!textBlocks.length) {
    return;
  }

  await new Promise((resolveFn) => appendTextRows(textBlocks[0], resolveFn));
  await timeout(getRandomInt(TIME_BETWEEN_TEXT_BLOCKS_MIN_MS, TIME_BETWEEN_TEXT_BLOCKS_MAX_MS));

  // Blank row between blocks if this is not the last block
  if (textBlocks.length - 1 > 0) {
    await new Promise((resolveFn) => appendTextRows([''], resolveFn));
  }

  appendTextBlocks(textBlocks.slice(1));
};

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

window.addEventListener('load', () => {
  appendTextBlocks(TEXT_BLOCKS);
});
