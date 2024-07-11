import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import call from '../../../dist/index.js';

/** @type {typeof import('./renderer.mjs').RendererApi} */
const rendererApi = call.use('RendererApi');
const isTest = process.argv.includes('--test');

const MainApi = {
  async startTests() {
    await rendererApi.startTests();
    testOutput();

    const rendererResult = await rendererApi.makeCall('main');
    testOutput(`  result: "${rendererResult}"`);

    if (isTest) {
      app.quit();
    }
  },

  makeCall(from) {
    testOutput(`MainApi.makeCall("from ${from}")`);
    return `${from}->main`;
  },

  log(text) {
    testOutput(text);
  },
};

function testOutput(text = '') {
  console.info(`${isTest ? ' - ' : ''}${text}`);
}

call.provide('MainApi', MainApi);

function main() {
  call.initialize();
  app.on('ready', createWindow).on('window-all-closed', () => app.quit());
}

function createWindow() {
  const win = new BrowserWindow({ height: 600, show: !isTest, width: 800 });

  return win.loadURL('file://' + path.join(__dirname, '../index.html'));
}

main();
