'use strict';

const { app, BrowserWindow } = require('electron');
const path = require('path');
const call = require('../..');

const isTest = process.argv.indexOf('--test');

function main() {
  const rendererApi = call.use('renderer');

  call.provide('main', {
    testInMain(arg1) {
      console.info(` - testInMain() is called with argument "${arg1}"`);

      setTimeout(async () => {
        const result = await rendererApi.testInRenderer('from main');
        console.info(` - testInRenderer() returned value "${result}"`);
        if (isTest) {
          app.quit();
        }
      });

      return Promise.resolve('result from main');
    },

    log(text) {
      console.info(text);
    },
  });

  app
    .on('ready', createWindow)
    .on('window-all-closed', () => app.quit());
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
