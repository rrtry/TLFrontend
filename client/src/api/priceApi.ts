import { request } from './client';
import type { PriceChangeDto } from '../dto/PriceChangeDto';

export function fetchPriceChanges(
  purchasedCurrency: string,
  paymentCurrency: string
): Promise<PriceChangeDto[]> {
  
  const fromDateTime = '2020-01-01T00:00:00Z';
  const params = new URLSearchParams({
    paymentCurrency,
    purchasedCurrency,
    fromDateTime,
  });

  return request<PriceChangeDto[]>(`/prices?${params.toString()}`);
}