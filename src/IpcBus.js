'use strict';

const IpcTransport = require('./transports/IpcTransport');

class IpcBus {
  constructor(transport = new IpcTransport()) {
    this.transport = null;
    this.handlers = {};

    this.onMessage = this.onMessage.bind(this);

    this.setTransport(transport);
  }

  setTransport(transport) {
    this.transport = transport;
    this.transport.onMessage(this.onMessage);
  }

  send(message) {
    this.transport.send(message);
  }

  registerMessageHandler(messageId, handler) {
    this.handlers[messageId] = handler;
  }

  unregisterMessageHandler(messageId) {
    delete this.handlers[messageId];
  }

  onMessage(message) {
    if (!message || !message.id) {
      return;
    }

    const handler = this.handlers[message.id];

    if (handler) {
      handler(message);
    }
  }
}

module.exports = IpcBus;
