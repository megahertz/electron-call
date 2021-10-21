import call from '../index';

class MainApi {
  async getAppName() {
    return 'test';
  }
}

call.provide('main', MainApi);


const mainApi = call.use<MainApi>('main')
mainApi.getAppName()
