import call from '../../../dist';
import type { MainApi } from './main';
import { RendererApi } from './renderer';

const mainApi = call.use<typeof MainApi>('MainApi');
const rendererApi = call.use<typeof RendererApi>('RendererApi');

export const PreloadApi = {
  async startTests() {
    const mainResult = await mainApi.makeCall('preload');
    await mainApi.log(`  result: "${mainResult}"`);

    const rendererResult = await rendererApi.makeCall('preload');
    await mainApi.log(`  result: "${rendererResult}"`);
  },

  async makeCall(from: string) {
    await mainApi.log(`PreloadApi.makeCall("from ${from}")`);
    return `${from}->preload`;
  },
};

call.provide('PreloadApi', PreloadApi);
