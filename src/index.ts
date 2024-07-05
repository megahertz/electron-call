import IpcBus from './IpcBus';
import IpcFacade from './IpcFacade';
import Logger from './Logger';
import RpcClient from './rpc/RpcClient';
import RpcServer from './rpc/RpcServer';
import IpcTransport from './transports/IpcTransport';

export function create() {
  const logger = new Logger({ target: console });
  const transport = new IpcTransport({ logger });
  const ipcBus = new IpcBus({ transport });
  const rpcClient = new RpcClient({ ipcBus });
  const rpcServer = new RpcServer({ ipcBus, logger });

  return new IpcFacade({ logger, rpcClient, rpcServer });
}

export default create;
