import { createPreloadFacade } from './index';

try {
  createPreloadFacade();
} catch (e) {
  // eslint-disable-next-line no-console
  console.error("Can't initialize electron-call in preload:", e);
}
