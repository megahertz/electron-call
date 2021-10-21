'use strict';

const IpcBus = require('./IpcBus');
const IpcFacade = require('./IpcFacade');
const Logger = require('./Logger');
const RpcClient = require('./rpc/RpcClient');
const RpcServer = require('./rpc/RpcServer');
const IpcTransport = require('./transports/IpcTransport');

function createFacade() {
  const logger = new Logger({ target: console });
  const transport = new IpcTransport({ logger });
  const ipcBus = new IpcBus({ transport });
  const rpcClient = new RpcClient({ ipcBus });
  const rpcServer = new RpcServer({ ipcBus, logger });

  return new IpcFacade({ rpcClient, rpcServer });
}

module.exports = createFacade();
module.exports.create = createFacade;
module.exports.default = module.exports;
