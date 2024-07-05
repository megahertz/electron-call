/* eslint-disable no-param-reassign */

export function serializeError(error: unknown) {
  return deepCopy(error);
}

export function deserializeError(errorData: Record<string, unknown>) {
  const error = new Error();
  deepCopy(errorData, error as unknown as Record<string, unknown>);
  return error;
}

function deepCopy(
  src: unknown,
  dest: Record<string, unknown> = {},
  seen = new WeakSet(),
) {
  if (!src || typeof src !== 'object') {
    return src;
  }

  const srcRecord = src as Record<string, unknown>;

  seen.add(src);

  for (const [key, value] of Object.entries(src)) {
    if (typeof value === 'function') {
      continue;
    }

    if (!value || typeof value !== 'object') {
      dest[key] = value;
      continue;
    }

    if (!seen.has(srcRecord[key] as object)) {
      dest[key] = deepCopy(srcRecord[key], {}, seen);
    }
  }

  for (const property of ['name', 'message', 'stack', 'code']) {
    if (typeof srcRecord[property] === 'string') {
      dest[property] = srcRecord[property];
    }
  }

  return dest;
}
