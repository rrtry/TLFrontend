import type { CurrencyDto } from '../dto/CurrencyDto';
import type { Currency } from '../models/Currency';

export function mapCurrency(dto: CurrencyDto): Currency {
  return {
    code: dto.code,
    name: dto.name,
    description: dto.description,
    symbol: dto.symbol,
  };
}