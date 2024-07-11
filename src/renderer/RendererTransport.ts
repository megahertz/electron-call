import type { LoggerFunctions } from '../core/Logger';
import { OnMessageCallback, RpcMessage, Transport } from '../core/types';

export default class RendererTransport implements Transport {
  private readonly logger: LoggerFunctions;
  private readonly window?: Window;

  constructor({ logger }: { logger: LoggerFunctions }) {
    this.logger = logger;

    if (typeof window === 'object') {
      this.window = window;
    } else {
      logger.error(
        'Failed to initialize RendererTransport: no global window object',
      );
    }

    // eslint-disable-next-line no-underscore-dangle
    if (!this.window?.__electronCall) {
      logger.error(
        'Failed to initialize RendererTransport: ' +
          "window.__electronCall isn't defined. " +
          'Make sure you call call.initialize() in the main process',
      );
    }
  }

  send(message: RpcMessage) {
    this.window?.postMessage({ cmd: 'fromRenderer', ...message });
  }

  onMessage(callback: OnMessageCallback) {
    this.window?.addEventListener('message', (event) => {
      const { cmd, ...message } = event.data || {};

      if (cmd === 'toRenderer') {
        callback(message);
      }
    });
  }
}
