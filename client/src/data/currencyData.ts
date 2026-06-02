export interface Currency {
  code: string;
  name: string;
  symbol: string;
  description: string;
}

export const currencies: Record<string, Currency> = {
  PLN: {
    code: 'PLN',
    name: 'Polish zloty',
    symbol: 'zł',
    description:
      'This is the official currency and legal tender of Poland. It is subdivided into 100 grosz-y (gr). It is the most traded currency in Central and Eastern Europe and ranks 21st most-traded in the foreign exchange market.',
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese yen',
    symbol: '¥',
    description:
      'The yen is the official currency of Japan. It is the third-most traded currency in the foreign exchange market, after the United States dollar and the euro. It is also widely used as a third reserve currency after the US dollar and the euro.',
  },
};

export const exchangeRate = {
  from: 'PLN',
  to: 'JPY',
  rate: 0.99,
  date: 'Fri, 05 Apr 2026 10:35 UTC',
};