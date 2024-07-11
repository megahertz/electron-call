import type { OnMessageCallback, RpcMessage, Transport } from './types';

export default class TestTransport implements Transport {
  private callback: OnMessageCallback | undefined;

  constructor() {
    this.callback = undefined;
  }

  onMessage(callback: OnMessageCallback) {
    this.callback = callback;
  }

  send(message: RpcMessage) {
    this.callback?.(message);
  }
}
