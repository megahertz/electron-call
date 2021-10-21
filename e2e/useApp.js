'use strict';

const childProcess = require('child_process');

module.exports = useApp;

function useApp(cwd, { timeout = 8000 } = {}) {
  return {
    timeout,

    async exec() {
      const output = await execNodeApp(cwd, timeout);

      const testOutput = output
        .split('\n')
        .filter((line) => line.startsWith(' -'))
        .map((line) => line.replace(/^\s-\s?/, ''));

      return { output, testOutput };
    },
  };
}

async function execNodeApp(cwd, timeout = 8000) {
  return new Promise((resolve, reject) => {
    let output = '';

    const process = childProcess.spawn('npm', ['start', '--', '--test'], {
      cwd,
    });

    process.stdout.on('data', (chunk) => { output += chunk; });
    process.stderr.on('data', (chunk) => { output += chunk; });

    let timeoutId = setTimeout(() => {
      process.kill();
      timeoutId = null;
    }, timeout - 100);

    process.on('close', (code) => {
      clearTimeout(timeoutId);

      const cleanOutput = output
        .replace(/^Fontconfig.*$/mg, '')
        .replace(/^.*called with multiple threads.*$/mg, '')
        .replace(/\n+/mg, '\n');

      if (code === 0 && timeoutId) {
        resolve(cleanOutput);
        return;
      }

      if (timeoutId === null) {
        reject(new Error(
          `Terminated by timeout (${(timeout / 1000)}s).\n${cleanOutput}`
        ));
        return;
      }

      reject(new Error(`Exist with status ${code}.\n${cleanOutput}`));
    });
  });
}
