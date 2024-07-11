import type { Session } from 'electron';
import type { LoggerFunctions } from '../Logger';
import type RpcClient from './RpcClient';
import type RpcServer from './RpcServer';
import type {
  ApiProxy,
  ApiProxyClass,
  PromisifyFunction,
  UnknownFn,
} from '../types';

export default class RpcFacade {
  private readonly logger: LoggerFunctions;
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
    logger: LoggerFunctions;
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

  // eslint-disable-next-line class-methods-use-this
  initialize(_options?: InitializeOptions) {
    throw new Error('initialize() call allowed in the main process only');
  }

  provide(
    apiName: string,
    apiInstance: object,
    options: { calledRecursive?: boolean; maxLevel?: number } = {},
  ) {
    const methods = getObjectMethods(apiInstance, options);
    methods.forEach(([name, method]) => {
      this.provideFunction(`${apiName}.${name}`, method.bind(apiInstance));
    });
  }

  provideFunction(functionName: string, handler: UnknownFn) {
    return this.rpcServer.provide(functionName, handler);
  }

  use<T = any>(apiName: string): ApiProxy<T> {
    return new Proxy(
      {},
      {
        get: (_target, name) =>
          this.useFunction(`${apiName}.${name.toString()}`),
      },
    ) as ApiProxy<T>;
  }

  useClass<T = any>(apiName: string): ApiProxyClass<T> {
    const { use } = this;

    return function ProxyConstructor() {
      return use(apiName);
    } as unknown as ApiProxyClass<T>;
  }

  useFunction<T extends UnknownFn = UnknownFn>(
    functionName: string,
  ): PromisifyFunction<T> {
    if (this.functionCache[functionName]) {
      return this.functionCache[
        functionName
      ] as unknown as PromisifyFunction<T>;
    }

    const proxyFn = (...args: unknown[]) =>
      this.rpcClient.call(functionName, ...args);
    Object.defineProperty(proxyFn, 'name', { value: functionName });

    this.functionCache[functionName] = proxyFn;

    return proxyFn as unknown as PromisifyFunction<T>;
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

export interface InitializeOptions {
  getSessions?: () => Array<Session | undefined>;
  includeFutureSessions?: boolean;
}
