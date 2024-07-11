import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import call from '../../../dist';
import type { RendererApi } from './renderer';

const isTest = process.argv.includes('--test');
const rendererApi = call.use<typeof RendererApi>('RendererApi');

export const MainApi = {
  async startTests() {
    await rendererApi.startTests();
    testOutput();

    const rendererResult = await rendererApi.makeCall('main');
    testOutput(`  result: "${rendererResult}"`);

    if (isTest) {
      app.quit();
    }
  },

  makeCall(from: string) {
    testOutput(`MainApi.makeCall("from ${from}")`);
    return `${from}->main`;
  },

  log(text: string) {
    testOutput(text);
  },
};

function testOutput(text: string = '') {
  console.info(`${isTest ? ' - ' : ''}${text}`);
}

function main() {
  call.initialize();
  call.provide('MainApi', MainApi);
  app.on('ready', createWindow).on('window-all-closed', () => app.quit());
}

function createWindow() {
  const win = new BrowserWindow({
    height: 600,
    show: !isTest,
    width: 800,
  });

  return win.loadURL(`file://${path.join(__dirname, '../index.html')}`);
}

main();
