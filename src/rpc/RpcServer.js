'use strict';

const { serializeError } = require('./error');

class RpcServer {
  /**
   * @param {IpcBus} ipcBus
   * @param {Logger} logger
   */
  constructor({ ipcBus, logger }) {
    this.ipcBus = ipcBus;
    this.logger = logger;
  }

  provide(functionName, handler) {
    const requestId = `rpc-request-${functionName}`;

    this.ipcBus.registerMessageHandler(requestId, (message) => {
      const callId = message.callId;
      if (!callId) {
        this.logger.warn(`${requestId} called, but callId isn't provided`);
        return;
      }

      const responseId = `rpc-response-${functionName}-${callId}`;
      this.callHandler(handler, message.arguments, responseId);
    });
  }

  callHandler(handler, handlerArguments, responseId) {
    if (!Array.isArray(handlerArguments)) {
      // eslint-disable-next-line no-param-reassign
      handlerArguments = [];
    }

    try {
      const result = handler.apply(null, handlerArguments);
      if (result && result.then && result.catch) {
        result
          .then((res) => this.sendResponse(responseId, res))
          .catch((e) => this.sendErrorResponse(responseId, e));
      } else {
        this.sendResponse(responseId, result);
      }
    } catch (e) {
      this.sendErrorResponse(responseId, e);
    }
  }

  sendResponse(responseId, result) {
    this.ipcBus.send({ id: responseId, result });
  }

  sendErrorResponse(responseId, error) {
    this.ipcBus.send({ id: responseId, error: serializeError(error) });
  }
}

module.exports = RpcServer;
