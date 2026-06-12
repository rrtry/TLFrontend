import { dataReducer, initialDataState } from './dataReducer';

describe('dataReducer', () => {

  it('should set loading on FETCH_START', () => {
    const state = dataReducer(initialDataState, { type: 'FETCH_START' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should store data on FETCH_SUCCESS', () => {

    // валюты и курсы
    const currencies = [{ code: 'CAD', name: 'Canadian dollar', description: '', symbol: '$' }];
    const priceChanges = [{ purchasedCurrencyCode: 'CAD', paymentCurrencyCode: 'PLN', price: 2.95, dateTime: '' }];
    const state = dataReducer(initialDataState, {
      type: 'FETCH_SUCCESS',
      payload: { currencies, priceChanges },
    });

    expect(state.currencies).toEqual(currencies);
    expect(state.priceChanges).toEqual(priceChanges);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set error on FETCH_ERROR', () => {
    const state = dataReducer(initialDataState, {
      type: 'FETCH_ERROR',
      payload: 'Network error',
    });
    expect(state.error).toBe('Network error');
    expect(state.loading).toBe(false);
  });
});