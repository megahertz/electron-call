'use strict';

const useApp = require('../useApp');

const app = useApp(__dirname);

describe('e2e simple', () => {
  it('checks that bi-directional communication works', async () => {
    const { testOutput } = await app.exec();

    expect(testOutput).toEqual([
      'testInMain() is called with argument "from renderer"',
      'testInMain() returned value "result from main"',
      'testInRenderer() is called with argument "from main"',
      'testInRenderer() returned value "result from renderer"',
    ]);
  }, app.timeout);
});
