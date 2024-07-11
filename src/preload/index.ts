import RpcBus from '../core/rpc/RpcBus';
import RpcFacade from '../core/rpc/RpcFacade';
import Logger from '../core/Logger';
import RpcClient from '../core/rpc/RpcClient';
import RpcServer from '../core/rpc/RpcServer';
import PreloadTransport from './PreloadTransport';

export function createPreloadFacade(): RpcFacade {
  const logger = new Logger({ target: console });
  const transport = new PreloadTransport({ logger });

  const rpcBus = new RpcBus({ transport });
  const rpcClient = new RpcClient({ rpcBus });
  const rpcServer = new RpcServer({ rpcBus, logger });

  const facade = new RpcFacade({ logger, rpcClient, rpcServer });

  transport.exposeToMainWorld({
    provide: facade.provide,
    provideFunction: facade.provideFunction,
    useFunction: facade.useFunction,
  });

  return facade;
}
