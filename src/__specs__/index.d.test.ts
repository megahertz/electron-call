import call from '../index';

class MainApi {
  async getAppName() {
    return 'test';
  }
}

call.provide(MainApi);


const mainApi = call.use<MainApi>()
mainApi.getAppName()
