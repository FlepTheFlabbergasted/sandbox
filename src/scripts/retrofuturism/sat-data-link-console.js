import { getRandomInt } from '../../util/get-random-int.js';
import { EventTypes } from './consts.js';

const sectionEl = document.getElementById('retrofuturism');
const satDataLinkConsoleDiv = sectionEl.querySelector('#sat-data-link-console');
const textContainerDiv = satDataLinkConsoleDiv.querySelector('.text-container');

const ANIM_TIME_PER_CHAR_MS = 10;
const TIME_BETWEEN_TEXT_BLOCKS_MIN_MS = 500;
const TIME_BETWEEN_TEXT_BLOCKS_MAX_MS = 2000;

const EVENT_TRIGGER_SAT_DATA_LINK_UP_STR = '   Connection status: Secure';
const EVENT_TRIGGER_SAT_DATA_LINK_DOWN_STR = 'Connection terminated successfully';
const EVENT_TRIGGER_SAT_DATA_UPLOAD_BEGIN_STR = 'Uploading mining data...';
const EVENT_TRIGGER_SAT_DATA_UPLOAD_END_STR = 'Data upload complete ...OK';

const TEXT_BLOCKS = [
  ['Flep ST-30 Systems, BIOs v2.7', 'Copyright (C) 2240, Flep System, Inc.', ''],
  [
    'CPU: Flep Qbit-42 XR-3250, 128 Cores, 3.60GHz',
    'MEM: FFMeP 1320 GB Quasi-Channel DDR32 RAM, 3200 MHz',
    'Storage: 21 PB M2-SSD, 11 TB Free',
    'Network: Galactic Network v2.5.6 (Stable)',
    '',
  ],
  ['Initiating Primary Boot Systems Sequence...', ''],
  [
    'Checking system integrity',
    '  Core processor status ............ OK',
    '  Navigation module ................ OK',
    '  Communications array ............. OK',
    '  FTL drive array .................. OK',
    '  Power distribution network ....... OK',
    '  Sensor grid ...................... OK',
    '',
    'System hardware checks complete',
    '',
  ],
  [
    'Life support and environmental systems',
    '  Life support systems ............. OK',
    '  Hull integrity ................... OK',
    '  Crew status monitors ............. OK',
    '',
    'Environmental checks complete',
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
    'All systems online',
    '',
  ],
  [
    'Initializing data transfer modules',
    '  Starting transmission handler ............ DONE',
    '  Starting encryption engine ............... DONE',
    '  Starting packet routing system ........... DONE',
    '  Starting data compression module ......... DONE',
    '  Starting file integrity checker .......... DONE',
    '  Starting logging system .................. DONE',
    '',
    'All data transfer modules ready',
    '',
  ],
  ['Initiating network modules...'],
  ['Starting network scan...'],
  ['Searching for available resources...', ''],
  [
    'Resources detected',
    '  PGID       PR   NI  VIRT    S   %CPU  %MEM  TIME+',
    '  ----       --   --  ----    -   ----  ----  -----',
    '  BRT-743-Y  36   19  36280   Y   7.3   6.9   0:21.50',
    '  UJW-936-H  72   0   33216   N   0.5   1.2   2:41.11',
    '  JQP-385-I  20   4   14304   N   0.1   66.3  0:05.19',
    '  JMC-037-A  20   0   13448   Y   15.1  23.1  1:13.53',
    '  LBW-910-N  63   3   8136    N   4.9   0.9   1:37.03',
    '  QWH-575-S  45   0   8136    N   0.8   33.1  0:41.57',
    '',
  ],
  [
    'Selecting target node: JMC-037-A',
    'Attempting to connect to node ...OK',
    'Initiating handshake...',
    'JMC-037-A node response received ...OK',
    '   Authentication accepted',
    '   Encryption link established (Protocol: Crystal Lock v3.1)',
    EVENT_TRIGGER_SAT_DATA_LINK_UP_STR,
    '',
  ],
  [
    'Checking node status...',
    'Running system diagnostic...',
    '',
    'JMC-037-A node system processes',
    'User       PID    %CPU  %MEM    VSZ    RSS    TIME   Command',
    '----       ---    ----  ----    ---    ---    ----   -------',
    'root       001    0.1   0.2     6428   1184   0:00   /system/init_core',
    'admin      135    2.3   4.1     11234  4528   5:12   /data/processing_unit',
    'research   212    15.7  10.6    45233  54208  32:43  /ai/research_module',
    'research   213    12.4  9.8     39028  49128  28:45  /ai/research_module',
    'comm       310    5.2   3.3     19842  9820   12:21  /comm/transmitter',
    'root       411    0.1   0.2     8348   1120   0:03   /system/log_handler',
    'root       521    0.0   0.1     6432   928    0:01   /system/monitor_agent',
    '',
  ],
  [
    'Beginning data transfer...',
    EVENT_TRIGGER_SAT_DATA_UPLOAD_BEGIN_STR,
    '  File                                 SIZE TB   STATUS',
    '  ----                                 -------   ------',
  ],
  ['  MINING_LOG_2024_01.DAT               54.3      [Uploaded ... OK]'],
  ['  MINERAL_ANALYSIS_XI.DAT              82.1      [Uploaded ... OK]'],
  ['  EXTRATERRESTRIAL_GEOLOGY_2024.DAT    91.7      [Uploaded ... OK]'],
  ['  LUNAR_SURFACE_PRESSURE_DYNAMICS.DAT  67.5      [Uploaded ... OK]'],
  ['  ORE_COMPOSITION_ETA-9.DAT            134.3     [Uploaded ... OK]'],
  ['  ASTEROID_MINE_SITE_12-17-2024.DAT    113.8     [Uploaded ... OK]'],
  ['  PLANETARY_MAGNETIC_FIELD_DATA.DAT    78.2      [Uploaded ... OK]'],
  ['  SEISMIC_ACTIVITY_LOG_2024.DAT        92.4      [Uploaded ... OK]'],
  ['  ATMOSPHERIC_SAMPLING_RESULTS.DAT     45.9      [Uploaded ... OK]'],
  ['  GRAVITATIONAL_WAVE_ANALYSIS.DAT      68.3      [Uploaded ... OK]'],
  ['  RESOURCE_EXTRACTION_LOG_2024.DAT     104.5     [Uploaded ... OK]', ''],
  [
    EVENT_TRIGGER_SAT_DATA_UPLOAD_END_STR,
    '',
    'Confirming receipt with JMC-037-A node ...OK',
    '  Status: Files successfully received ...OK',
    '',
  ],
  [
    'Retrieving mining project status from JMC-037-A node ... OK',
    ' Metric                                  Value                     ',
    ' ------                                  -----',
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
    '',
  ],
  [
    'Terminating connection...',
    'Disconnecting from node JMC-037-A ... OK',
    'Closing encryption channel ... OK',
    '',
    EVENT_TRIGGER_SAT_DATA_LINK_DOWN_STR,
    '',
  ],
  ['Returning to idle mode ... OK', 'Engaging system standby ... OK'],
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
  dispatchEvents(content);

  appendTextRows(textRows.slice(1), completeCallbackFn);
};

const appendTextBlocks = async (textBlocks) => {
  if (!textBlocks.length) {
    return;
  }

  await new Promise((resolveFn) => appendTextRows(textBlocks[0], resolveFn));
  await timeout(getRandomInt(TIME_BETWEEN_TEXT_BLOCKS_MIN_MS, TIME_BETWEEN_TEXT_BLOCKS_MAX_MS));

  appendTextBlocks(textBlocks.slice(1));
};

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dispatchEvents = (content) => {
  if (content === EVENT_TRIGGER_SAT_DATA_LINK_UP_STR) {
    window.dispatchEvent(new Event(EventTypes.SatDataLinkUp));
  } else if (content === EVENT_TRIGGER_SAT_DATA_LINK_DOWN_STR) {
    window.dispatchEvent(new Event(EventTypes.SatDataLinkDown));
  }

  if (content === EVENT_TRIGGER_SAT_DATA_UPLOAD_BEGIN_STR) {
    window.dispatchEvent(new Event(EventTypes.SatDataUploadBegin));
  } else if (content === EVENT_TRIGGER_SAT_DATA_UPLOAD_END_STR) {
    window.dispatchEvent(new Event(EventTypes.SatDataUploadEnd));
  }
};

window.addEventListener('load', () => {
  appendTextBlocks(TEXT_BLOCKS);
});
