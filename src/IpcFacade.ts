import type Logger from './Logger';
import type RpcClient from './rpc/RpcClient';
import type RpcServer from './rpc/RpcServer';
import { UnknownFn } from './utils/types';

export default class IpcFacade {
  private readonly logger: Logger;
  private readonly rpcClient: RpcClient;
  private readonly rpcServer: RpcServer;
  private readonly functionCache: Record<
    string,
    (...args: unknown[]) => unknown
  >;

  constructor({
    logger,
    rpcClient,
    rpcServer,
  }: {
    logger: Logger;
    rpcClient: RpcClient;
    rpcServer: RpcServer;
  }) {
    this.logger = logger;
    this.rpcClient = rpcClient;
    this.rpcServer = rpcServer;

    this.functionCache = {};

    this.call = this.call.bind(this);
    this.provide = this.provide.bind(this);
    this.provideFunction = this.provideFunction.bind(this);
    this.use = this.use.bind(this);
    this.useClass = this.useClass.bind(this);
    this.useFunction = this.useFunction.bind(this);
  }

  async call(functionId: string, ...args: unknown[]) {
    return this.rpcClient.call(functionId, ...args);
  }

  provide(
    apiName: string,
    apiInstance: object,
    options: { calledRecursive?: boolean; maxLevel?: number },
  ) {
    const methods = getObjectMethods(apiInstance, options);
    methods.forEach(([name, method]) => {
      this.provideFunction(`${apiName}.${name}`, method.bind(apiInstance));
    });
  }

  provideFunction(functionName: string, handler: UnknownFn) {
    return this.rpcServer.provide(functionName, handler);
  }

  use(apiName: string) {
    return new Proxy(
      {},
      {
        get: (_target, name) =>
          this.useFunction(`${apiName}.${name.toString()}`),
      },
    );
  }

  useClass(apiName: string) {
    const { use } = this;

    return function ProxyConstructor() {
      return use(apiName);
    };
  }

  useFunction(functionName: string) {
    if (this.functionCache[functionName]) {
      return this.functionCache[functionName];
    }

    const proxyFn = (...args: unknown[]) =>
      this.rpcClient.call(functionName, ...args);
    Object.defineProperty(proxyFn, 'name', { value: functionName });

    this.functionCache[functionName] = proxyFn;

    return proxyFn;
  }
}

function getObjectMethods(
  object: object,
  { calledRecursive = false, maxLevel = 5 } = {},
) {
  if (!object || typeof object !== 'object') {
    return [];
  }

  const descriptors = Object.getOwnPropertyDescriptors(object);
  const methods = Object.entries(descriptors)
    .map(([name, desc]) => [name, desc.value])
    .filter(([_, func]) => typeof func === 'function');

  const parent = Object.getPrototypeOf(object);
  if (parent && maxLevel > 0 && parent.constructor !== Object) {
    methods.push(
      ...getObjectMethods(parent, {
        calledRecursive: true,
        maxLevel: maxLevel - 1,
      }),
    );
  }

  if (!calledRecursive) {
    const filtered = [];
    const methodNames = new Set();
    for (const method of methods) {
      if (methodNames.has(method[0])) {
        continue;
      }

      filtered.push(method);
      methodNames.add(method[0]);
    }

    return filtered;
  }

  return methods;
}
