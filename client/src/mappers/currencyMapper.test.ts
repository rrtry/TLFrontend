import { mapCurrency } from './currencyMapper';
import type { CurrencyDto } from '../dto/CurrencyDto';

describe('currencyMapper', () => {
  it('map CurrencyDto -> Currency', () => {
    const dto: CurrencyDto = {
      code: 'USD',
      name: 'US Dollar',
      description: 'United States currency',
      symbol: '$',
    };
    expect(mapCurrency(dto)).toEqual({
      code: 'USD',
      name: 'US Dollar',
      description: 'United States currency',
      symbol: '$',
    });
  });
});