declare namespace ElectronCall {
  interface IpcFacade {
    logger: Logger;
    provide(apiName: string, apiInstance: object);
    provideFunction(functionName: string, fn: Func);
    use<T = any>(apiName: string): ApiProxy<T>;
    useClass<T = any>(apiName: string): { new(): ApiProxy<T> };
    useFunction<T extends Func = Func>(apiName: string): PromisifyFunction<T>;
  }

  interface Logger {
    level: 0 | 1 | 2 | 3;
    target: any;

    debug(...args: any[]);
    error(...args: any[]);
    info(...args: any[]);
    warn(...args: any[]);
  }

  export type ApiProxy<T> = {
    [P in keyof T]: T[P] extends Func ? PromisifyFunction<T[P]> : never;
  };

  type WrapToPromise<T> = T extends Promise<any> ? T : Promise<T>;
  type PromisifyFunction<T extends Func> = (
    ...a: Parameters<T>
  ) => WrapToPromise<ReturnType<T>>;

  type Func = (...args: any) => any;
}

// Merge namespace with interface
declare const ElectronCall: ElectronCall.IpcFacade & {
  create: () => ElectronCall.IpcFacade;
  default: ElectronCall.IpcFacade;
}
export = ElectronCall;
