import RpcBus from './rpc/RpcBus';
import RpcFacade from './rpc/RpcFacade';
import Logger from './utils/Logger';
import RpcClient from './rpc/RpcClient';
import RpcServer from './rpc/RpcServer';
import IpcTransport from './transports/IpcTransport';

export function create() {
  const logger = new Logger({ target: console });
  const transport = new IpcTransport({ logger });

  const rpcBus = new RpcBus({ transport });
  const rpcClient = new RpcClient({ rpcBus });
  const rpcServer = new RpcServer({ rpcBus, logger });

  return new RpcFacade({ logger, rpcClient, rpcServer });
}

export default create();
