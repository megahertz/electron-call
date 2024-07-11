import type { Session } from 'electron';
import RpcFacade, { type InitializeOptions } from '../core/rpc/RpcFacade';
import { safeRequire } from '../core/utils/node';
import { initializePreloadBridge } from '../preload/initializePreloadBridge';

const electron = safeRequire('electron');
const fs = safeRequire('node:fs');
const os = safeRequire('node:os');
const path = safeRequire('node:path');

export default class MainFacade extends RpcFacade {
  private isInitialized = false;

  initialize({
    getSessions = () => [electron?.session?.defaultSession],
    includeFutureSessions = false,
  }: InitializeOptions = {}) {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    if (!electron || !fs || !os || !path) {
      throw new Error(
        'Failed MainFacade.initialize(): ' +
          "Looks like it's called outside of the main process",
      );
    }

    if (!electron.app) {
      throw new Error(
        'Failed MainFacade.initialize(): electron.app is undefined',
      );
    }

    let preloadPath = path.join(__dirname, 'electron-call-preload.js');
    if (!preloadPath || !fs.existsSync(preloadPath)) {
      preloadPath = path.join(
        electron.app.getPath('userData') || os.tmpdir(),
        'electron-call-preload.js',
      );
      const preloadCode = [
        'try {',
        `  (`,
        initializePreloadBridge.toString(),
        `  )(require('electron'));`,
        `} catch(e) {`,
        `  console.error(e);`,
        `}`,
      ].join('\n');
      fs.writeFileSync(preloadPath, preloadCode, 'utf8');
    }

    if (electron.app.isReady()) {
      injectPreload();
    } else {
      electron.app.once('ready', injectPreload);
    }

    if (includeFutureSessions) {
      electron.app.on('session-created', (session) => setPreload(session));
    }

    function injectPreload() {
      for (const session of getSessions().filter(Boolean)) {
        setPreload(session as Session);
      }
    }

    function setPreload(session: Session) {
      session.setPreloads([...session.getPreloads(), preloadPath]);
    }
  }
}
