import { request } from './client';
import type { CurrencyDto } from '../dto/CurrencyDto';

export function fetchCurrencies(): Promise<CurrencyDto[]> {
  return request<CurrencyDto[]>('/Currency');
}