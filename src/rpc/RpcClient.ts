import IpcBus from '../IpcBus';
import { deserializeError } from './error';

export default class RpcClient {
  private readonly ipcBus: IpcBus;
  private callCounter: number;

  constructor({ ipcBus }: { ipcBus: IpcBus }) {
    this.ipcBus = ipcBus;
    this.callCounter = 1;
  }

  async call(functionName: string, ...args: unknown[]) {
    const requestId = `rpc-request-${functionName}`;
    const callId = this.makeCallId();
    const responseId = `rpc-response-${functionName}-${callId}`;

    return new Promise((resolve, reject) => {
      this.ipcBus.registerMessageHandler(responseId, (message) => {
        if (message.error) {
          reject(deserializeError(message.error));
        } else {
          resolve(message.result);
        }

        this.ipcBus.unregisterMessageHandler(responseId);
      });

      this.ipcBus.send({ id: requestId, callId, arguments: args });
    });
  }

  makeCallId() {
    this.callCounter += 1;
    return this.callCounter;
  }
}
