// eslint-disable-next-line import/prefer-default-export
export function has(
  object: unknown,
  key: string,
): object is Record<string, unknown> {
  return Boolean(object && typeof object === 'object' && key in object);
}
