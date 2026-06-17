import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useConverter } from './useConverter';
import * as currencyApi from '../api/currencyApi';
import * as priceApi from '../api/priceApi';

vi.mock('../api/currencyApi');
vi.mock('../api/priceApi');

const mockCurrencies = [
  { code: 'CAD', name: 'Canadian dollar', description: 'CAD desc', symbol: '$' },
  { code: 'PLN', name: 'Polish zloty', description: 'PLN desc', symbol: 'zł' },
  { code: 'AUD', name: 'Australian dollar', description: 'AUD desc', symbol: '$' },
];

const mockPriceHistory = [
  { purchasedCurrencyCode: 'CAD', paymentCurrencyCode: 'PLN', price: 2.95, dateTime: '2026-01-01T00:00:00Z' },
  { purchasedCurrencyCode: 'CAD', paymentCurrencyCode: 'PLN', price: 2.96, dateTime: '2026-01-01T00:00:10Z' },
];

describe('useConverter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.mocked(currencyApi.fetchCurrencies).mockResolvedValue(mockCurrencies);
    vi.mocked(priceApi.fetchPriceChanges).mockResolvedValue(mockPriceHistory);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('загружает список валют и возвращает их', async () => {
    const { result } = renderHook(() => useConverter());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.currencies).toHaveLength(3);
    expect(result.current.error).toBeNull();
  });

  it('обрабатывает ошибку загрузки валют', async () => {
    vi.mocked(currencyApi.fetchCurrencies).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useConverter());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.currencies).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('загружает последний курс после загрузки валют', async () => {

    const { result } = renderHook(() => useConverter());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.priceChanges).toHaveLength(1);
    expect(result.current.priceChanges[0].price).toBe(2.96);
    expect(result.current.rate).toBe(2.96);
    expect(result.current.result).toBe(2.96);
    expect(result.current.rateLoading).toBe(false);
    expect(result.current.rateError).toBeNull();
  });

  it('обновляет курс при смене валютной пары (from)', async () => {

    vi.mocked(priceApi.fetchPriceChanges)
      .mockResolvedValueOnce(mockPriceHistory)
      .mockResolvedValueOnce([
        { purchasedCurrencyCode: 'AUD', paymentCurrencyCode: 'PLN', price: 1.5, dateTime: '2026-01-01T00:01:00Z' },
      ]);

    const { result } = renderHook(() => useConverter());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.rate).toBe(2.96);

    act(() => {
      result.current.setFrom('AUD');
    });
    
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0); // Ждём изменения курса 
    });

    // AUD
    expect(priceApi.fetchPriceChanges).toHaveBeenCalledTimes(2);
    expect(result.current.priceChanges).toHaveLength(1);
    expect(result.current.priceChanges[0].price).toBe(1.5);
    expect(result.current.rate).toBe(1.5);
  });

  it('корректно обрабатывает пустой ответ истории (rate = 0)', async () => {
    vi.mocked(priceApi.fetchPriceChanges).mockResolvedValue([]);

    const { result } = renderHook(() => useConverter());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.priceChanges).toHaveLength(0);
    expect(result.current.rate).toBe(0);
    expect(result.current.result).toBe(0);
  });

  it('обрабатывает ошибку загрузки курса', async () => {
    vi.mocked(priceApi.fetchPriceChanges).mockRejectedValue(new Error('Timeout'));

    const { result } = renderHook(() => useConverter());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.rateError).toBe('Timeout');
    expect(result.current.priceChanges).toHaveLength(0);
    expect(result.current.rate).toBe(0);
  });

  it('пересчитывает result при изменении amountInput', async () => {

    const { result } = renderHook(() => useConverter());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.rate).toBe(2.96);
    expect(result.current.result).toBe(2.96);

    act(() => {
      result.current.setAmount('10');
    });

    expect(result.current.result).toBe(29.6);
  });

  it('swap меняет местами from и to', async () => {

    const { result } = renderHook(() => useConverter());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    act(() => {
      result.current.swap();
    });

    expect(result.current.from).toBe('PLN');
    expect(result.current.to).toBe('CAD');
  });

  it('setFrom на ту же валюту, что и to, вызывает обмен', async () => {

    const { result } = renderHook(() => useConverter());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    act(() => {
      result.current.setFrom('PLN');
    });

    expect(result.current.from).toBe('PLN');
    expect(result.current.to).toBe('CAD');
  });

  it('setTo на ту же валюту, что и from, вызывает обмен', async () => {
    const { result } = renderHook(() => useConverter());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    act(() => {
      result.current.setTo('CAD');
    });

    expect(result.current.from).toBe('PLN');
    expect(result.current.to).toBe('CAD');
  });
});