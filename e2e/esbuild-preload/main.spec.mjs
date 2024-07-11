import { expect, describe, it } from 'vitest';
import useApp from '../useApp.mjs';
import packageJson from './package.json';

const app = useApp(__dirname);

describe(packageJson.name, () => {
  it('checks that bi-directional communication works', async () => {
    const { testOutput } = await app.exec();

    expect(testOutput).toEqual([
      'MainApi.makeCall("from renderer")',
      '  result: "renderer->main"',
      'PreloadApi.makeCall("from renderer")',
      '  result: "renderer->preload"',
      '',
      'MainApi.makeCall("from preload")',
      '  result: "preload->main"',
      'RendererApi.makeCall("from preload")',
      '  result: "preload->renderer"',
      '',
      'RendererApi.makeCall("from main")',
      '  result: "main->renderer"',
      'PreloadApi.makeCall("from main")',
      '  result: "main->preload"',
    ]);
  });
});
