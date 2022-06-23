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

  provide(apiName, apiInstance = null) {
    const methods = getObjectMethods(apiInstance);
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
    const proxyFn = (...args) => this.rpcClient.call(functionName, ...args);
    Object.defineProperty(proxyFn, 'name', { value: functionName });
    return proxyFn;
  }
}

module.exports = IpcFacade;

function getObjectMethods(object) {
  let prototype = object
    && object.constructor
    && object.constructor.prototype;
  if (!prototype) {
    return [];
  }

  if (object && object.constructor === Object) {
    prototype = object;
  }

  const descriptors = Object.getOwnPropertyDescriptors(prototype);

  return Object.entries(descriptors)
    .map(([name, desc]) => [name, desc.value])
    .filter(([_, func]) => typeof func === 'function');
}
