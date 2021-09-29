/* eslint-disable no-param-reassign */

'use strict';

module.exports = {
  serializeError,
  deserializeError,
};

function serializeError(error) {
  return deepCopy(error);
}

function deserializeError(errorData) {
  const error = new Error();
  deepCopy(errorData, error);
  return error;
}

function deepCopy(src, dest = {}, seen = new WeakSet()) {
  seen.add(src);

  for (const [key, value] of Object.entries(src)) {
    if (typeof value === 'function') {
      continue;
    }

    if (!value || typeof value !== 'object') {
      dest[key] = value;
      continue;
    }

    if (!seen.has(src[key])) {
      dest[key] = deepCopy(src[key], {}, seen);
    }
  }

  for (const property of ['name', 'message', 'stack', 'code']) {
    if (typeof src[property] === 'string') {
      dest[property] = src[property];
    }
  }

  return dest;
}
