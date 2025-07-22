import type { DeepPartial } from './types';

export function typedMock<T>(implementation: DeepPartial<T>): T {
    return implementation as unknown as T;
  }
  