import RpcBus from './RpcBus';
import { deserializeError } from './error';

export default class RpcClient {
  private readonly rpcBus: RpcBus;
  private callCounter: number;

  constructor({ rpcBus }: { rpcBus: RpcBus }) {
    this.rpcBus = rpcBus;
    this.callCounter = 1;
  }

  async call(functionName: string, ...args: unknown[]) {
    const requestId = `rpc-request-${functionName}`;
    const callId = this.makeCallId();
    const responseId = `rpc-response-${functionName}-${callId}`;

    return new Promise((resolve, reject) => {
      this.rpcBus.registerMessageHandler(responseId, (message) => {
        if (message.error) {
          reject(deserializeError(message.error));
        } else {
          resolve(message.result);
        }

        this.rpcBus.unregisterMessageHandler(responseId);
      });

      this.rpcBus.send({ id: requestId, callId, arguments: args });
    });
  }

  makeCallId() {
    this.callCounter += 1;
    return this.callCounter;
  }
}
