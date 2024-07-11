import { IPC_CHANNEL } from '../core/const';
import type { LoggerFunctions } from '../core/Logger';
import type { OnMessageCallback, Transport } from '../core/types';
import { safeRequire } from '../core/utils/node';
import { prepareDataForIpcSend } from '../core/utils/object';

const electron = safeRequire('electron');

export default class MainTransport implements Transport {
  private readonly logger: LoggerFunctions;

  constructor({ logger }: { logger: LoggerFunctions }) {
    this.logger = logger;
  }

  send(message: object) {
    if (!electron?.webContents) {
      this.logger.error(
        "MainTransport.send() error: Can't use electron.webContents",
      );
      return;
    }

    this.logger.debug('SEND', message);

    electron.webContents.getAllWebContents().forEach((ctx) => {
      ctx.send(IPC_CHANNEL, prepareDataForIpcSend(message));
    });
  }

  onMessage(callback: OnMessageCallback) {
    if (!electron?.ipcMain) {
      this.logger.error(
        "MainTransport.onMessage error: Can't use electron.ipcMain",
      );
      return;
    }

    electron.ipcMain.on(IPC_CHANNEL, (_event, payload) => {
      this.logger.debug('RECEIVE', payload);
      callback(payload);
    });
  }
}
