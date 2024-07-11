export function has(
  object: unknown,
  key: string,
): object is Record<string, unknown> {
  return Boolean(object && typeof object === 'object' && key in object);
}

export function prepareDataForIpcSend(message: object) {
  return JSON.parse(JSON.stringify(message, createSerializer()));
}

function createSerializer() {
  const seen = new WeakSet();

  return (
    key: string,
    value: {
      stack: any;
      toJSON: () => any;
      toString: () => string;
      preventDefault: any;
      type: any;
    },
  ) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }

      seen.add(value);
    }

    return serializeNode(key, value);
  };
}

function serializeNode(_key: string, value: unknown) {
  if (value instanceof Error) {
    return value.stack;
  }

  if (!value) {
    return value;
  }

  if (typeof value === 'function') {
    return `[function] ${(value as object).toString()}`;
  }

  if (value instanceof Map) {
    return Object.fromEntries(value);
  }

  if (value instanceof Set) {
    return Array.from(value);
  }

  if (has(value, 'toJSON') && typeof value.toJSON === 'function') {
    return value.toJSON();
  }

  if (has(value, 'preventDefault')) {
    return `Event ${value.type || ''}`;
  }

  return value;
}
