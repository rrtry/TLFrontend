import { mapPriceChange } from './priceChangeMapper';
import type { PriceChangeDto } from '../dto/PriceChangeDto';

describe('priceChangeMapper', () => {
  it('map PriceChangeDto -> PriceChange', () => {
    const dto: PriceChangeDto = {
      purchasedCurrencyCode: 'CAD',
      paymentCurrencyCode: 'PLN',
      price: 2.95,
      dateTime: '2026-04-27T09:00:00.000Z',
    };
    expect(mapPriceChange(dto)).toEqual({
      purchasedCurrencyCode: 'CAD',
      paymentCurrencyCode: 'PLN',
      price: 2.95,
      dateTime: '2026-04-27T09:00:00.000Z',
    });
  });
});