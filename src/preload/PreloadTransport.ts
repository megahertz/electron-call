import type { LoggerFunctions } from '../core/Logger';
import type {
  ElectronCallWeb,
  OnMessageCallback,
  PreloadBridge,
  RpcMessage,
  Transport,
} from '../core/types';
import { safeRequire } from '../core/utils/node';
import { initializePreloadBridge } from './initializePreloadBridge';

const electron = safeRequire('electron') || {};

export default class PreloadTransport implements Transport {
  private readonly logger: LoggerFunctions;
  private readonly preloadBridge?: PreloadBridge;

  constructor({ logger }: { logger: LoggerFunctions }) {
    this.logger = logger;
    this.preloadBridge = initializePreloadBridge(electron, {
      exposeImmediately: false,
      logger,
    });
  }

  exposeToMainWorld(exposedObject: ElectronCallWeb) {
    this.preloadBridge?.exposeToMainWorld(exposedObject);
  }

  send(message: RpcMessage) {
    if (!this.preloadBridge) {
      this.logger.error('Failed to send message, preload bridge uninitialized');
      return;
    }

    this.preloadBridge.send(message);
  }

  onMessage(callback: OnMessageCallback) {
    if (!this.preloadBridge) {
      this.logger.error('Failed to subscribe, preload bridge uninitialized');
      return;
    }

    this.preloadBridge.onMessage(callback);
  }
}
