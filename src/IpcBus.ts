import type IpcTransport from './transports/IpcTransport';

export default class IpcBus {
  private transport: IpcTransport;
  private readonly handlers: Record<string | number, MessageHandler>;

  constructor({ transport }: { transport: IpcTransport }) {
    this.transport = transport;
    this.handlers = {};

    this.onMessage = this.onMessage.bind(this);

    this.setTransport(transport);
  }

  setTransport(transport: IpcTransport) {
    this.transport = transport;
    this.transport.onMessage(this.onMessage);
  }

  send(message: object) {
    this.transport.send(message);
  }

  registerMessageHandler(messageId: string | number, handler: MessageHandler) {
    this.handlers[messageId] = handler;
  }

  unregisterMessageHandler(messageId: string | number) {
    delete this.handlers[messageId];
  }

  onMessage(message: IpcMessage) {
    if (!message || !message.id) {
      return;
    }

    const handler = this.handlers[message.id];
    if (handler) {
      handler(message);
    }
  }
}

export type MessageHandler = (message: IpcMessage) => void;

export interface IpcMessage {
  arguments: any;
  callId: any;
  error?: any;
  id: any;
  result?: any;
}
