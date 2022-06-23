'use strict';

let electron;

try {
  // eslint-disable-next-line global-require
  electron = require('electron');
} catch (e) {
  electron = null;
}

const IPC_CHANNEL = '__ELECTRON_CALL__';

class IpcTransport {
  /**
   * @param {Logger} logger
   */
  constructor({ logger }) {
    this.logger = logger;
  }

  send(message) {
    this.logger.debug('SEND', message);

    if (process.type === 'browser') {
      sendIpcToRenderer(IPC_CHANNEL, message);
    } else if (process.type === 'renderer') {
      sendIpcToMain(IPC_CHANNEL, message);
    }
  }

  onMessage(callback) {
    const ipc = getIpc();
    if (ipc) {
      ipc.on(IPC_CHANNEL, (event, payload) => {
        this.logger.debug('RECEIVE', payload);
        callback(payload);
      });
    }
  }
}

module.exports = IpcTransport;

function getIpc() {
  if (!electron) {
    return null;
  }

  if (process.type === 'browser' && electron.ipcMain) {
    return electron.ipcMain;
  }

  if (process.type === 'renderer' && electron.ipcRenderer) {
    return electron.ipcRenderer;
  }

  return null;
}

function sendIpcToMain(channel, message) {
  const ipc = getIpc();
  if (ipc) {
    ipc.send(channel, prepareDataForIpcSend(message));
  }
}

function sendIpcToRenderer(channel, message) {
  if (!electron || !electron.BrowserWindow) {
    return;
  }

  electron.BrowserWindow.getAllWindows().forEach((wnd) => {
    if (!wnd.webContents) {
      return;
    }

    wnd.webContents.send(channel, prepareDataForIpcSend(message));
  });
}

function prepareDataForIpcSend(message) {
  return JSON.parse(JSON.stringify(message, createSerializer()));
}

function createSerializer() {
  const seen = new WeakSet();

  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }

      seen.add(value);
    }

    return serializeNode(key, value);
  };
}

function serializeNode(key, value) {
  if (value instanceof Error) {
    return value.stack;
  }

  if (!value) {
    return value;
  }

  if (typeof value.toJSON === 'function') {
    return value.toJSON();
  }

  if (typeof value === 'function') {
    return '[function] ' + value.toString();
  }

  if (value instanceof Map) {
    return Object.fromEntries(value);
  }

  if (value instanceof Set) {
    return Array.from(value);
  }

  if (value.preventDefault) {
    return `Event ${value.type || ''}`;
  }

  return value;
}
