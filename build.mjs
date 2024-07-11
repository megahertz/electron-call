#!/usr/bin/env node

import { generateDtsBundle } from 'dts-bundle-generator';
import esbuild from 'esbuild';
import * as fs from 'node:fs';

const withTypes = !process.argv.includes('--no-types');

await esbuild.build({
  bundle: true,
  entryPoints: ['src/index.ts'],
  external: ['electron'],
  format: 'cjs',
  footer: {
    js: `
      try {
        if (
          typeof src_default !== 'undefined' &&
          typeof module !== 'undefined' &&
          typeof module.exports !== 'undefined'
        ) {
          Object.assign(src_default, module.exports);
          module.exports = src_default;
        }
      } catch (e) {
        // Skip
      }
    `,
  },
  outdir: './dist',
  platform: 'node',
  sourcemap: true,
});

await esbuild.build({
  bundle: true,
  entryPoints: ['src/preload/electron-call-preload.ts'],
  format: 'cjs',
  outdir: './dist',
  sourcemap: true,
});

if (withTypes) {
  const [dtsBundle] = generateDtsBundle([{ filePath: 'src/index.ts' }]);
  await fs.promises.writeFile('dist/index.d.ts', dtsBundle);
}
