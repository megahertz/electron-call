// noinspection JSUnusedLocalSymbols

import call from '../index';

class MainApi {
  async getAppName() {
    return 'test';
  }
}

function testProvide() {
  call.provide('MainApi', MainApi);
}

async function testUse() {
  const mainApi = call.use<MainApi>('MainApi')
  const result: string = await mainApi.getAppName()
}

async function testUseClass() {
  class MainApiProxy extends call.useClass<MainApi>('MainApi') {}
  const mainApi = new MainApiProxy();
  const result: string = await mainApi.getAppName();
}



