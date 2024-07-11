import call from '../../../dist';
import type { MainApi } from './main';

const mainApi = call.use<typeof MainApi>('MainApi');

export const RendererApi = {
  async startTests() {
    const mainResult = await mainApi.makeCall('renderer');
    await mainApi.log(`  result: "${mainResult}"`);
  },

  async makeCall(from: string) {
    await mainApi.log(`RendererApi.makeCall("from ${from}")`);
    return `${from}->renderer`;
  },
};

call.provide('RendererApi', RendererApi);

mainApi.startTests().catch(console.error);
