import type { PriceChange } from '../models/PriceChange';
import rawPriceChanges from './2_hw_mock_price_changes.json';

export const priceChanges: Record<string, Record<string, PriceChange>> = rawPriceChanges as Record<string, Record<string, PriceChange>>;