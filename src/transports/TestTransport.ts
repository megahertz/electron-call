import Transport, { OnMessageCallback } from './Transport';

export default class TestTransport implements Transport {
  private callback: OnMessageCallback | undefined;

  constructor() {
    this.callback = undefined;
  }

  onMessage(callback: OnMessageCallback) {
    this.callback = callback;
  }

  send(message: object) {
    this.callback?.(message);
  }
}
