import RpcFacade from './rpc/RpcFacade';

export type UnknownFn = (...args: unknown[]) => unknown;

export type OnMessageCallback = (message: RpcMessage) => void;

export interface RpcMessage {
  arguments?: any;
  callId?: any;
  error?: any;
  id: any;
  result?: any;
}

export interface Transport {
  send(message: RpcMessage): void;
  onMessage(callback: OnMessageCallback): void;
}

export interface ElectronCallWeb
  extends Pick<RpcFacade, 'provide' | 'provideFunction' | 'useFunction'> {
  isEmpty?: boolean;
}

export interface PreloadBridge extends Transport {
  exposeToMainWorld(exposedObject?: ElectronCallWeb): boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
  const __electronCall: ElectronCallWeb;
  interface Window {
    __electronCall?: ElectronCallWeb;
  }
}

type AnyFn = (...args: any) => any;

export type ApiProxy<T> = {
  [P in keyof T]: T[P] extends AnyFn ? PromisifyFunction<T[P]> : never;
};

export type ApiProxyClass<T> = { new (): ApiProxy<T> };

type WrapToPromise<T> = T extends Promise<any> ? T : Promise<T>;
export type PromisifyFunction<T extends AnyFn> = (
  ...a: Parameters<T>
) => WrapToPromise<ReturnType<T>>;
