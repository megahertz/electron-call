'use strict';

class IpcFacade {
  constructor(rpcClient, rpcServer) {
    this.rpcClient = rpcClient;
    this.rpcServer = rpcServer;
  }

  async call(functionId, ...args) {
    return this.rpcClient.call(functionId, ...args);
  }

  provide(functionId, handler) {
    return this.rpcServer.provide(functionId, handler);
  }

  provideApi(apiInstance) {
    const methods = getObjectMethods(apiInstance);
    methods.forEach(([name, method]) => {
      this.provide(name, method.bind(apiInstance));
    });
  }

  createClient() {
    const rpcClient = this.rpcClient;

    return new Proxy(
      {},
      {
        get(target, name) {
          return (...args) => rpcClient.call(name, ...args);
        },
      }
    );
  }
}

module.exports = IpcFacade;

function getObjectMethods(object) {
  const prototype = object
    && object.constructor
    && object.constructor.prototype;
  if (!prototype) {
    return [];
  }

  const descriptors = Object.getOwnPropertyDescriptors(prototype);

  return Object.entries(descriptors)
    .map(([name, desc]) => [name, desc.value])
    .filter(([_, func]) => typeof func === 'function');
}
