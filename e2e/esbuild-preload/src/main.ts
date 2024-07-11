import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import call from '../../../dist';
import { PreloadApi } from './preload';
import type { RendererApi } from './renderer';

const isTest = process.argv.includes('--test');

const preloadApi = call.use<typeof PreloadApi>('PreloadApi');
const rendererApi = call.use<typeof RendererApi>('RendererApi');

export const MainApi = {
  async startTests() {
    await rendererApi.startTests();
    testOutput();

    await preloadApi.startTests();
    testOutput();

    const rendererResult = await rendererApi.makeCall('main');
    testOutput(`  result: "${rendererResult}"`);

    const preloadResult = await preloadApi.makeCall('main');
    testOutput(`  result: "${preloadResult}"`);

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

function createWindow() {
  const win = new BrowserWindow({
    height: 600,
    show: !isTest,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 800,
  });

  return win.loadURL(`file://${path.join(__dirname, '../index.html')}`);
}

call.provide('MainApi', MainApi);
app.on('ready', createWindow).on('window-all-closed', () => app.quit());
