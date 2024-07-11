export default [
  {
    mode: 'development',
    devtool: false,
    entry: ['./src/main.mjs'],
    output: { filename: 'main.js' },
    target: 'electron-main',
    stats: 'minimal',
  },
  {
    mode: 'development',
    devtool: false,
    entry: ['./src/renderer.mjs'],
    output: { filename: 'renderer.js' },
    target: 'electron-renderer',
    stats: 'minimal',
  },
];
