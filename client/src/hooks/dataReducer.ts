import type { Currency } from '../models/Currency';
import type { PriceChange } from '../models/PriceChange';

export interface DataState {
  currencies: Currency[];
  priceChanges: PriceChange[];
  loading: boolean;
  error: string | null;
}

export type DataAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { currencies: Currency[]; priceChanges: PriceChange[] } }
  | { type: 'FETCH_ERROR'; payload: string };

export const initialDataState: DataState = {
  currencies: [],
  priceChanges: [],
  loading: false,
  error: null,
};

export function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        currencies: action.payload.currencies,
        priceChanges: action.payload.priceChanges,
        loading: false,
        error: null,
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}