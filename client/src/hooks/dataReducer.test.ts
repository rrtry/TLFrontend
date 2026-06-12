import { dataReducer, initialDataState } from './dataReducer';

describe('dataReducer', () => {
  it('should set loading on FETCH_START', () => {
    const state = dataReducer(initialDataState, { type: 'FETCH_START' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should store data on FETCH_SUCCESS', () => {

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
  
  it('should set rateLoading on FETCH_RATE_START and clear rateError', () => {

    const prevState = {
      ...initialDataState,
      rateError: 'Previous rate error',
    };

    const state = dataReducer(prevState, { type: 'FETCH_RATE_START' });
    expect(state.rateLoading).toBe(true);
    expect(state.rateError).toBeNull();

    // проверяем, что другие поля не изменились
    expect(state.loading).toBe(prevState.loading);
    expect(state.error).toBe(prevState.error);
  });

  it('should update priceChanges and clear rateLoading/rateError on FETCH_RATE_SUCCESS', () => {

    const priceChanges = [
      { purchasedCurrencyCode: 'AUD', paymentCurrencyCode: 'JPY', price: 95.77, dateTime: '2026-01-02T00:00:00Z' },
    ];

    const prevState = {
      ...initialDataState,
      rateLoading: true,
      rateError: 'Previous rate error',
    };

    const state = dataReducer(prevState, {
      type: 'FETCH_RATE_SUCCESS',
      payload: { priceChanges },
    });

    expect(state.priceChanges).toEqual(priceChanges);
    expect(state.rateLoading).toBe(false);
    expect(state.rateError).toBeNull();
  });

  it('should set rateError and clear rateLoading on FETCH_RATE_ERROR', () => {
    
    const prevState = {
      ...initialDataState,
      rateLoading: true,
    };

    const state = dataReducer(prevState, {
      type: 'FETCH_RATE_ERROR',
      payload: 'Rate fetch failed',
    });

    expect(state.rateError).toBe('Rate fetch failed');
    expect(state.rateLoading).toBe(false);
    // проверяем, что общая ошибка не затронута
    expect(state.error).toBe(prevState.error);
  });
});