import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { usePriceChanges } from './usePriceChanges';
import * as priceApi from '../api/priceApi';
import type { PriceChangeDto } from '../dto/PriceChangeDto';

vi.mock('../api/priceApi');

const mockPriceHistory: PriceChangeDto[] = [
  { purchasedCurrencyCode: 'CAD', paymentCurrencyCode: 'PLN', price: 2.95, dateTime: '2026-01-01T00:00:00Z' },
  { purchasedCurrencyCode: 'CAD', paymentCurrencyCode: 'PLN', price: 2.96, dateTime: '2026-01-01T00:00:10Z' },
];

describe('usePriceChanges', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.mocked(priceApi.fetchPriceChanges).mockResolvedValue(mockPriceHistory);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('начальное состояние', () => {
    const { result } = renderHook(() => usePriceChanges('CAD', 'PLN', 1));
    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('загружает и маппит изменения курса при монтировании', async () => {

    const { result } = renderHook(() => usePriceChanges('CAD', 'PLN', 1));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].price).toBe(2.95);
    expect(result.current.data[1].price).toBe(2.96);
  });

  it('обновляется при смене валюты (from)', async () => {
    vi.mocked(priceApi.fetchPriceChanges)
      .mockResolvedValueOnce(mockPriceHistory)
      .mockResolvedValueOnce([
        {
          purchasedCurrencyCode: 'AUD',
          paymentCurrencyCode: 'PLN',
          price: 1.5,
          dateTime: '2026-01-01T00:01:00Z',
        },
      ]);

    const { result, rerender } = renderHook(
      ({ from }) => usePriceChanges(from, 'PLN', 1),
      { initialProps: { from: 'CAD' } }
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.data).toHaveLength(2);
    rerender({ from: 'AUD' });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(priceApi.fetchPriceChanges).toHaveBeenCalledTimes(2);
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].price).toBe(1.5);
  });

  it('обновляется при смене периода', async () => {
    const { rerender } = renderHook(
      ({ period }) => usePriceChanges('CAD', 'PLN', period),
      { initialProps: { period: 1 } }
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(priceApi.fetchPriceChanges).toHaveBeenCalledTimes(1);
    rerender({ period: 5 });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    
    expect(priceApi.fetchPriceChanges).toHaveBeenCalledTimes(2);
  });

  it('автообновление каждые 10 секунд', async () => {
    renderHook(() => usePriceChanges('CAD', 'PLN', 1));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(priceApi.fetchPriceChanges).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(priceApi.fetchPriceChanges).toHaveBeenCalledTimes(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(priceApi.fetchPriceChanges).toHaveBeenCalledTimes(3);
  });

  it('очищает таймер при размонтировании', async () => {
    const { unmount } = renderHook(() => usePriceChanges('CAD', 'PLN', 1));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(priceApi.fetchPriceChanges).toHaveBeenCalledTimes(1);

    unmount();

    // Продвигаем время на 20 секунд - вызовов быть не должно
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20_000);
    });

    expect(priceApi.fetchPriceChanges).toHaveBeenCalledTimes(1);
  });

  it('отменяет предыдущий запрос при быстрой смене', async () => {

    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    vi.mocked(priceApi.fetchPriceChanges).mockImplementation(
      (_purchased, _payment, _from, _to, signal) =>
        new Promise((resolve) => {
          setTimeout(() => {
            if (!signal?.aborted) resolve(mockPriceHistory);
          }, 5000);
        })
    );

    const { rerender } = renderHook(
      ({ from }) => usePriceChanges(from, 'PLN', 1),
      { initialProps: { from: 'CAD' } }
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    rerender({ from: 'AUD' });

    // Старый контроллер должен быть отменён
    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });

  it('обрабатывает ошибку запроса', async () => {

    vi.mocked(priceApi.fetchPriceChanges).mockRejectedValue(new Error('Timeout'));
    const { result } = renderHook(() => usePriceChanges('CAD', 'PLN', 1));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.error).toBe('Timeout');
    expect(result.current.loading).toBe(false);
  });
});