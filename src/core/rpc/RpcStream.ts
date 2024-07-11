import { RpcMessage } from '../types';

export abstract class RpcStream {
  abstract send(message: RpcMessage): void;
  abstract onMessage(callback: (message: RpcMessage) => void): void;

  pipe(stream: RpcStream): RpcStream {
    this.onMessage((message) => {
      stream.send(message);
    });
    return stream;
  }
}
