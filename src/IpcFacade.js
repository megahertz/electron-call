'use strict';

class IpcFacade {
  /**
   * @param {RpcClient} rpcClient
   * @param {RpcServer} rpcServer
   */
  constructor({ rpcClient, rpcServer }) {
    this.rpcClient = rpcClient;
    this.rpcServer = rpcServer;
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

  useFunction(functionName) {
    return (...args) => this.rpcClient.call(functionName, ...args);
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
