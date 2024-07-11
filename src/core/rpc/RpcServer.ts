import type RpcBus from './RpcBus';
import type { LoggerFunctions } from '../Logger';
import { has } from '../utils/object';
import type { UnknownFn } from '../types';
import { serializeError } from './error';

export default class RpcServer {
  private readonly rpcBus: RpcBus;
  private readonly logger: LoggerFunctions;

  constructor({ rpcBus, logger }: { rpcBus: RpcBus; logger: LoggerFunctions }) {
    this.rpcBus = rpcBus;
    this.logger = logger;
  }

  provide(functionName: string, handler: UnknownFn) {
    const requestId = `rpc-request-${functionName}`;

    this.rpcBus.registerMessageHandler(requestId, (message) => {
      const { callId } = message;
      if (!callId) {
        this.logger.warn(`${requestId} called, but callId isn't provided`);
        return;
      }

      const responseId = `rpc-response-${functionName}-${callId}`;
      this.callHandler(handler, message.arguments, responseId);
    });
  }

  callHandler(handler: UnknownFn, handlerArguments: any[], responseId: string) {
    if (!Array.isArray(handlerArguments)) {
      // eslint-disable-next-line no-param-reassign
      handlerArguments = [];
    }

    try {
      const result = handler(...handlerArguments);
      if (
        has(result, 'then') &&
        typeof result.then === 'function' &&
        typeof result.catch === 'function'
      ) {
        result
          .then((res: unknown) => this.sendResponse(responseId, res))
          .catch((e: unknown) => this.sendErrorResponse(responseId, e));
      } else {
        this.sendResponse(responseId, result);
      }
    } catch (e) {
      this.sendErrorResponse(responseId, e);
    }
  }

  sendResponse(responseId: string, result: unknown) {
    this.rpcBus.send({ id: responseId, result });
  }

  sendErrorResponse(responseId: string, error: unknown) {
    this.rpcBus.send({ id: responseId, error: serializeError(error) });
  }
}
