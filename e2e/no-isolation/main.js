'use strict';

const { app, BrowserWindow } = require('electron');
const path = require('path');
const call = require('../../dist');

const isTest = process.argv.includes('--test');
const rendererApi = call.use('RendererApi');

call.provide('MainApi', {
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
});

function testOutput(text = '') {
  console.info(`${isTest ? ' - ' : ''}${text}`);
}

function main() {
  app.on('ready', createWindow).on('window-all-closed', () => app.quit());
}

function createWindow() {
  const win = new BrowserWindow({
    height: 600,
    show: !isTest,
    webPreferences: { contextIsolation: false, nodeIntegration: true },
    width: 800,
  });

  return win.loadURL('file://' + path.join(__dirname, 'index.html'));
}

main();
