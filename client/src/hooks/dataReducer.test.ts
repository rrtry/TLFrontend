import { dataReducer, initialDataState } from './dataReducer';
import type { DataState } from './dataReducer';

type TestData = string[];

describe('dataReducer', () => {
  const initial: DataState<TestData> = initialDataState<TestData>([]);

  it('should set loading on FETCH_START', () => {
    const state = dataReducer<TestData>(initial, { type: 'FETCH_START' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.data).toEqual([]);
  });

  it('should store data on FETCH_SUCCESS', () => {
    const payload: TestData = ['a', 'b'];
    const state = dataReducer<TestData>(initial, {
      type: 'FETCH_SUCCESS',
      payload,
    });
    expect(state.data).toEqual(payload);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set error on FETCH_ERROR', () => {
    const state = dataReducer<TestData>(initial, {
      type: 'FETCH_ERROR',
      payload: 'Network error',
    });
    expect(state.error).toBe('Network error');
    expect(state.loading).toBe(false);
  });

  it('should preserve existing data on FETCH_START', () => {
    const withData = dataReducer<TestData>(initial, {
      type: 'FETCH_SUCCESS',
      payload: ['x'],
    });
    const state = dataReducer<TestData>(withData, { type: 'FETCH_START' });
    expect(state.data).toEqual(['x']);
    expect(state.loading).toBe(true);
  });

  it('should clear error on FETCH_SUCCESS', () => {
    const errored = dataReducer<TestData>(initial, {
      type: 'FETCH_ERROR',
      payload: 'fail',
    });
    const state = dataReducer<TestData>(errored, {
      type: 'FETCH_SUCCESS',
      payload: ['ok'],
    });
    expect(state.error).toBeNull();
    expect(state.data).toEqual(['ok']);
  });
});