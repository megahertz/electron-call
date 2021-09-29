'use strict';

const IpcBus = require('./IpcBus');
const IpcFacade = require('./IpcFacade');
const RpcClient = require('./rpc/RpcClient');
const RpcServer = require('./rpc/RpcServer');

function createIpc() {
  const ipcBus = new IpcBus();
  const rpcClient = new RpcClient(ipcBus);
  const rpcServer = new RpcServer(ipcBus);

  return new IpcFacade(rpcClient, rpcServer);
}

module.exports = createIpc;
module.exports.default = module.exports;
