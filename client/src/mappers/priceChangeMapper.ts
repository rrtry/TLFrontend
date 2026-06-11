import type { PriceChangeDto } from '../dto/PriceChangeDto';
import type { PriceChange } from '../models/PriceChange';

export function mapPriceChange(dto: PriceChangeDto): PriceChange {
  return {
    purchasedCurrencyCode: dto.purchasedCurrencyCode,
    paymentCurrencyCode: dto.paymentCurrencyCode,
    price: dto.price,
    dateTime: dto.dateTime,
  };
}