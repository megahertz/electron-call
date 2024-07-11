import call from '../../../dist';
import type { MainApi } from './main';
import type { PreloadApi } from './preload';

const mainApi = call.use<typeof MainApi>('MainApi');
const preloadApi = call.use<typeof PreloadApi>('PreloadApi');

export const RendererApi = {
  async startTests() {
    const mainResult = await mainApi.makeCall('renderer');
    await mainApi.log(`  result: "${mainResult}"`);

    const preloadResult = await preloadApi.makeCall('renderer');
    await mainApi.log(`  result: "${preloadResult}"`);
  },

  async makeCall(from: string) {
    await mainApi.log(`RendererApi.makeCall("from ${from}")`);
    return `${from}->renderer`;
  },
};

call.provide('RendererApi', RendererApi);

startMainTests().catch(console.warn);

async function startMainTests() {
  await mainApi.startTests();
}
