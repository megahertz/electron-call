import { describe, expect, it } from 'vitest';
import { serializeError } from '../error';

describe('error', () => {
  describe(serializeError.name, () => {
    it('should serialize simple Error', () => {
      const serialized = serializeError(new Error('test'));

      expect(serialized).toEqual({
        name: 'Error',
        message: 'test',
        stack: expect.any(String),
      });
    });
  });
});
