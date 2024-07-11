import call from '../../../dist/index.js';

/** @type {typeof import('./main.mjs').MainApi} */
const mainApi = call.use('MainApi');

const RendererApi = {
  async startTests() {
    const mainResult = await mainApi.makeCall('renderer');
    await mainApi.log(`  result: "${mainResult}"`);
  },

  async makeCall(from) {
    await mainApi.log(`RendererApi.makeCall("from ${from}")`);
    return `${from}->renderer`;
  },
};

call.provide('RendererApi', RendererApi);

mainApi.startTests().catch(console.error);
