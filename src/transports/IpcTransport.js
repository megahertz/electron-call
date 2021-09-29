'use strict';

let electron;

try {
  // eslint-disable-next-line global-require,import/no-unresolved
  electron = require('electron');
} catch (e) {
  electron = null;
}

const IPC_CHANNEL = '__ELECTRON_CALL__';

class IpcTransport {
  send(message) {
    // eslint-disable-next-line no-console
    console.log('SEND', message);

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
        // eslint-disable-next-line no-console
        console.log('RECEIVE', payload);
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
    ipc.send(channel, message);
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

    wnd.webContents.send(channel, message);
  });
}
