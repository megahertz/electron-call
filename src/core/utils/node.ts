import type Electron from 'electron';
import type Fs from 'node:fs';
import type Os from 'node:os';
import type Path from 'node:path';

/**
 * Return undefined if the module can't require module
 * Used in a case when the code is run in unknown runtime
 * Should be bundlers-friendly
 */
export function safeRequire<T extends keyof TypeMap>(
  path: T,
): TypeMap[T] | undefined {
  try {
    // eslint-disable-next-line global-require,import/no-dynamic-require,@typescript-eslint/no-var-requires
    return require(path) as TypeMap[T];
  } catch (e) {
    // Try the next method
  }

  try {
    return __non_webpack_require__(path);
  } catch (e) {
    // Ignore
  }

  return undefined;
}

type TypeMap = {
  'node:fs': typeof Fs;
  'node:os': typeof Os;
  'node:path': typeof Path;
  'electron': typeof Electron;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
declare function __non_webpack_require__(modulePath: string): any;
