import { program } from 'commander';
import fs from 'node:fs';

/**
 * @example
 * npm run create-section -- --name flep-flep
 * node create-section --name flep-flep
 */
const options = program
  .name('create-section')
  .requiredOption('--name <VALUE>', 'Name of section in kebab-case (e.g. my-new-section)')
  .parse(process.argv)
  .opts();

const createScriptFile = (name) => {
  const scriptFileContent = `const sectionEl = document.getElementById('${name}');\n\nwindow.addEventListener('load', () => {});`;
  createFileWithContent(`./src/scripts/${name}.js`, scriptFileContent);
};

const addScriptFileImport = (name) => {
  const importStatement = `import './scripts/${name}.js;'\n`;
  prependFileWithContent(`./src/index.js`, importStatement);
};

const createStyleFile = (name) => {
  const styleFileContent = `#${name} {\n\n}`;
  createFileWithContent(`./src/styles/${name}.scss`, styleFileContent);
};

const addStyleFileImport = (name) => {
  const importStatement = `@use 'styles/${name}.scss';\n`;
  prependFileWithContent(`./src/index.scss`, importStatement);
};

const addSectionToHtmlFile = (name) => {
  const filefilePath = './public/index.html';
  const content = `\n<section id="${name}" class="center-content"></section>\n`;

  const currentFileContent = fs.readFileSync(filefilePath, { encoding: 'utf8' });
  const lastIndexOfClosingBodyTag = currentFileContent.lastIndexOf('</body>');
  const newFileContent =
    currentFileContent.substring(0, lastIndexOfClosingBodyTag) +
    content +
    currentFileContent.substring(lastIndexOfClosingBodyTag);

  fs.writeFileSync(filefilePath, newFileContent, { encoding: 'utf8' });
};

const createFileWithContent = (filePath, content) => {
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

const prependFileWithContent = (filefilePath, content) => {
  const currentFileContent = fs.readFileSync(filefilePath);
  const fileDescriptor = fs.openSync(filefilePath, 'w+');
  const contentBuffer = Buffer.from(content);

  fs.writeSync(fileDescriptor, contentBuffer, 0, contentBuffer.length, 0);
  fs.writeSync(fileDescriptor, currentFileContent, 0, currentFileContent.length, contentBuffer.length);

  fs.close(fileDescriptor, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

if (options.name) {
  createScriptFile(options.name);
  createStyleFile(options.name);
  addScriptFileImport(options.name);
  addStyleFileImport(options.name);
  addSectionToHtmlFile(options.name);
}
