import type { OnMessageCallback, RpcMessage, Transport } from '../types';

export default class RpcBus {
  private transport: Transport;
  private readonly handlers: Record<string | number, OnMessageCallback>;

  constructor({ transport }: { transport: Transport }) {
    this.transport = transport;
    this.handlers = {};

    this.onMessage = this.onMessage.bind(this);

    this.setTransport(transport);
  }

  setTransport(transport: Transport) {
    this.transport = transport;
    this.transport.onMessage(this.onMessage);
  }

  send(message: RpcMessage) {
    this.transport.send(message);
  }

  registerMessageHandler(
    messageId: string | number,
    handler: OnMessageCallback,
  ) {
    this.handlers[messageId] = handler;
  }

  unregisterMessageHandler(messageId: string | number) {
    delete this.handlers[messageId];
  }

  onMessage(message: RpcMessage) {
    if (!message || !message.id) {
      return;
    }

    const handler = this.handlers[message.id];
    if (handler) {
      handler(message);
    }
  }
}
