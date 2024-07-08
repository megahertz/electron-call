import electron, { IpcMain, IpcRenderer } from 'electron';
import Logger from '../utils/Logger';
import { has } from '../utils/object';
import type Transport from './Transport';

const isMainProcess = 'type' in process && process.type === 'browser';

const IPC_CHANNEL = '__ELECTRON_CALL__';

export default class IpcTransport implements Transport {
  private readonly logger: Logger;

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
  }

  send(message: object) {
    this.logger.debug('SEND', message);

    if (isMainProcess) {
      sendIpcToRenderer(IPC_CHANNEL, message);
    } else {
      sendIpcToMain(IPC_CHANNEL, message);
    }
  }

  onMessage(callback: (arg0: any) => void) {
    getIpc()?.on(IPC_CHANNEL, (_event, payload) => {
      this.logger.debug('RECEIVE', payload);
      callback(payload);
    });
  }
}

function getIpc(): IpcMain | IpcRenderer | undefined {
  if (!electron) {
    return undefined;
  }

  if (isMainProcess && electron.ipcMain) {
    return electron.ipcMain;
  }

  if (!isMainProcess && electron.ipcRenderer) {
    return electron.ipcRenderer;
  }

  return undefined;
}

function sendIpcToMain(channel: string, message: object) {
  electron.ipcRenderer.send(channel, prepareDataForIpcSend(message));
}

function sendIpcToRenderer(channel: string, message: object) {
  if (!electron || !electron.BrowserWindow) {
    return;
  }

  electron.BrowserWindow.getAllWindows().forEach(
    (wnd: { webContents: { send: (arg0: any, arg1: any) => void } }) => {
      if (!wnd.webContents) {
        return;
      }

      wnd.webContents.send(channel, prepareDataForIpcSend(message));
    },
  );
}

function prepareDataForIpcSend(message: object) {
  return JSON.parse(JSON.stringify(message, createSerializer()));
}

function createSerializer() {
  const seen = new WeakSet();

  return (
    key: string,
    value: {
      stack: any;
      toJSON: () => any;
      toString: () => string;
      preventDefault: any;
      type: any;
    },
  ) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }

      seen.add(value);
    }

    return serializeNode(key, value);
  };
}

function serializeNode(_key: string, value: unknown) {
  if (value instanceof Error) {
    return value.stack;
  }

  if (!value) {
    return value;
  }

  if (typeof value === 'function') {
    return `[function] ${(value as object).toString()}`;
  }

  if (value instanceof Map) {
    return Object.fromEntries(value);
  }

  if (value instanceof Set) {
    return Array.from(value);
  }

  if (has(value, 'toJSON') && typeof value.toJSON === 'function') {
    return value.toJSON();
  }

  if (has(value, 'preventDefault')) {
    return `Event ${value.type || ''}`;
  }

  return value;
}
