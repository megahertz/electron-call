import type { RpcMessage, Transport } from './types';

export default class Bridge implements Transport {
  private readonly transportA: Transport;
  private readonly transportB: Transport;

  constructor({
    transportA,
    transportB,
    direction = 'duplex',
  }: {
    transportA: Transport;
    transportB: Transport;
    direction?: Direction;
  }) {
    this.transportA = transportA;
    this.transportB = transportB;

    if (direction === 'ab' || direction === 'duplex') {
      this.transportA.onMessage(this.transportB.send.bind(this.transportB));
    }

    if (direction === 'ba' || direction === 'duplex') {
      this.transportB.onMessage(this.transportA.send.bind(this.transportA));
    }
  }

  send(message: RpcMessage) {
    this.transportA.send(message);
  }

  onMessage(callback: (message: RpcMessage) => void) {
    this.transportA.onMessage(callback);
    this.transportB.onMessage(callback);
  }
}

type Direction = 'ab' | 'ba' | 'duplex';
