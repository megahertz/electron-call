import RpcBus from '../core/rpc/RpcBus';
import Logger from '../core/Logger';
import RpcClient from '../core/rpc/RpcClient';
import RpcFacade from '../core/rpc/RpcFacade';
import RpcServer from '../core/rpc/RpcServer';
import MainFacade from './MainFacade';
import MainTransport from './MainTransport';

export function createMainFacade(): RpcFacade {
  const logger = new Logger({ target: console });
  const transport = new MainTransport({ logger });

  const rpcBus = new RpcBus({ transport });
  const rpcClient = new RpcClient({ rpcBus });
  const rpcServer = new RpcServer({ rpcBus, logger });

  return new MainFacade({ logger, rpcClient, rpcServer });
}
