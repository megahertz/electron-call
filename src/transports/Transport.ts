export default interface Transport {
  send(message: object): void;
  onMessage(callback: OnMessageCallback): void;
}

export type OnMessageCallback = (payload: object) => void;
