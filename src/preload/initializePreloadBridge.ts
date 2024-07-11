/* eslint-disable no-underscore-dangle */
// noinspection JSConstantReassignment

import type Electron from 'electron';
import type { LoggerFunctions } from '../core/Logger';
import {
  ElectronCallWeb,
  OnMessageCallback,
  PreloadBridge,
  RpcMessage,
} from '../core/types';

export function initializePreloadBridge(
  {
    contextBridge,
    ipcRenderer,
  }: {
    contextBridge?: Electron.ContextBridge;
    ipcRenderer?: Electron.IpcRenderer;
  },
  {
    exposeImmediately = true,
    logger = console,
  }: { exposeImmediately?: boolean; logger?: LoggerFunctions } = {},
): PreloadBridge | undefined {
  const IPC_CHANNEL = '__ELECTRON_CALL__';

  if (!ipcRenderer) {
    logger?.error('No ipcRenderer available');
    return undefined;
  }

  if (typeof window !== 'object') {
    logger?.error('No global window object');
    return undefined;
  }

  const handlers: OnMessageCallback[] = [];
  const alreadyExposedToMain =
    typeof window === 'object' && window.__electronCall;

  ipcRenderer?.on(IPC_CHANNEL, (_event, message) => {
    handlers.forEach((handler) => handler(message));
    if (!alreadyExposedToMain) {
      window.postMessage({ cmd: 'toRenderer', ...message });
    }
  });

  window.addEventListener('message', (event) => {
    const { cmd, ...message } = event.data || {};
    if (cmd === 'fromRenderer') {
      handlers.forEach((handler) => handler(message));
      if (!alreadyExposedToMain) {
        ipcRenderer?.send(IPC_CHANNEL, message);
      }
    }
  });

  if (exposeImmediately) {
    exposeToMainWorld();
  }

  return {
    exposeToMainWorld,

    send(message: RpcMessage) {
      try {
        ipcRenderer?.send(IPC_CHANNEL, message);
        window.postMessage({ cmd: 'toRenderer', ...message });
      } catch (e) {
        logger?.error('Failed to send message:', e);
      }
    },
    onMessage(callback: OnMessageCallback) {
      handlers.push(callback);
    },
  };

  function exposeToMainWorld(
    exposedObject = { isEmpty: true } as ElectronCallWeb,
  ): boolean {
    if (alreadyExposedToMain) {
      return false;
    }

    if (contextBridge && process.contextIsolated) {
      try {
        contextBridge.exposeInMainWorld('__electronCall', exposedObject);
      } catch (e) {
        logger?.error('Failed to expose electronCall to main world:', e);
      }
    }

    if (typeof window === 'object') {
      window.__electronCall = exposedObject as any;
    } else {
      // @ts-expect-error Define global variable
      __electronCall = exposedObject;
    }

    return true;
  }
}
