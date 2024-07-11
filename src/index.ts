import type RpcFacade from './core/rpc/RpcFacade';
import { safeRequire } from './core/utils/node';
import { createMainFacade } from './main';
import { createPreloadFacade } from './preload';
import { createRendererFacade } from './renderer';

const electron = safeRequire('electron');

export function create(): RpcFacade {
  if (electron?.ipcMain) {
    return createMainFacade();
  }

  if (electron?.ipcRenderer) {
    return createPreloadFacade();
  }

  return createRendererFacade();
}

export default create();
