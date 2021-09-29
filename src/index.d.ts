declare namespace ElectronCall {
  interface IpcFacade {
    provide(instance: object);
    use<T = any>(name?: string): ApiProxy<T>;
  }

  export type ApiProxy<T> = {
    [P in keyof T]: T[P] extends (...a: any) => any
      ? PromisifyFunction<T[P]>
      : never;
  };

  type WrapToPromise<T> = T extends Promise<any> ? T : Promise<T>;
  type PromisifyFunction<T extends (...a: any) => any> = (
    ...a: Parameters<T>
  ) => WrapToPromise<ReturnType<T>>;
}

// Merge namespace with interface
declare const ElectronCall: ElectronCall.IpcFacade & {
  default: ElectronCall.IpcFacade;
}
export = ElectronCall;
