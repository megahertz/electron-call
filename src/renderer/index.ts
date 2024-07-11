import RpcBus from '../core/rpc/RpcBus';
import RpcFacade from '../core/rpc/RpcFacade';
import Logger from '../core/Logger';
import RpcClient from '../core/rpc/RpcClient';
import RpcServer from '../core/rpc/RpcServer';
import RendererTransport from './RendererTransport';

export function createRendererFacade(): RpcFacade {
  const logger = new Logger({ target: console });
  const transport = new RendererTransport({ logger });

  const rpcBus = new RpcBus({ transport });
  const rpcClient = new RpcClient({ rpcBus });
  const rpcServer = new RpcServer({ rpcBus, logger });

  return new RpcFacade({ logger, rpcClient, rpcServer });
}
