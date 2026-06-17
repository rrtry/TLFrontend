import { request } from './client';
import type { PriceChangeDto } from '../dto/PriceChangeDto';

export function fetchPriceChanges(
  purchasedCurrency: string,
  paymentCurrency: string,
  fromDateTime: string,
  toDateTime?: string,
  signal?: AbortSignal
): Promise<PriceChangeDto[]> {
  const params = new URLSearchParams({
    paymentCurrency,
    purchasedCurrency,
    fromDateTime,
  });
  if (toDateTime) {
    params.append('toDateTime', toDateTime);
  }
  return request<PriceChangeDto[]>(`/prices?${params.toString()}`, { signal });
}