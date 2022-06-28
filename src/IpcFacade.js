'use strict';

class IpcFacade {
  /**
   * @param {Logger} logger
   * @param {RpcClient} rpcClient
   * @param {RpcServer} rpcServer
   */
  constructor({ logger, rpcClient, rpcServer }) {
    this.logger = logger;
    this.rpcClient = rpcClient;
    this.rpcServer = rpcServer;

    this.functionCache = new Map();

    this.call = this.call.bind(this);
    this.provide = this.provide.bind(this);
    this.provideFunction = this.provideFunction.bind(this);
    this.use = this.use.bind(this);
    this.useClass = this.useClass.bind(this);
    this.useFunction = this.useFunction.bind(this);
  }

  async call(functionId, ...args) {
    return this.rpcClient.call(functionId, ...args);
  }

  provide(apiName, apiInstance = null, options) {
    const methods = getObjectMethods(apiInstance, options);
    methods.forEach(([name, method]) => {
      this.provideFunction(`${apiName}.${name}`, method.bind(apiInstance));
    });
  }

  provideFunction(functionName, handler) {
    return this.rpcServer.provide(functionName, handler);
  }

  use(apiName) {
    return new Proxy(
      {},
      {
        get: (target, name) => this.useFunction(`${apiName}.${name}`),
      }
    );
  }

  useClass(apiName) {
    const use = this.use;

    return function ProxyConstructor() {
      return use(apiName);
    };
  }

  useFunction(functionName) {
    if (this.functionCache[functionName]) {
      return this.functionCache[functionName];
    }

    const proxyFn = (...args) => this.rpcClient.call(functionName, ...args);
    Object.defineProperty(proxyFn, 'name', { value: functionName });

    this.functionCache[functionName] = proxyFn;

    return proxyFn;
  }
}

module.exports = IpcFacade;

function getObjectMethods(
  object,
  {
    calledRecursive = false,
    maxLevel = 5,
  } = {}
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
      })
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
