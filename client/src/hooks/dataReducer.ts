import type { Currency } from '../models/Currency';
import type { PriceChange } from '../models/PriceChange';

export interface DataState {
  currencies: Currency[];
  priceChanges: PriceChange[];
  loading: boolean;
  rateLoading: boolean;
  error: string | null;
  rateError: string | null;
}

export type DataAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { currencies: Currency[]; priceChanges: PriceChange[] } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'FETCH_RATE_START' }
  | { type: 'FETCH_RATE_SUCCESS'; payload: { priceChanges: PriceChange[] } }
  | { type: 'FETCH_RATE_ERROR'; payload: string };

export const initialDataState: DataState = {
  currencies: [],
  priceChanges: [],
  loading: false,
  rateLoading: false,
  error: null,
  rateError: null,
};

export function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    
    case 'FETCH_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        currencies: action.payload.currencies,
        priceChanges: action.payload.priceChanges,
        loading: false,
        error: null,
      };

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'FETCH_RATE_START':
      return { ...state, rateLoading: true, rateError: null };

    case 'FETCH_RATE_SUCCESS':
      return {
        ...state,
        priceChanges: action.payload.priceChanges,
        rateLoading: false,
        rateError: null,
      };

    case 'FETCH_RATE_ERROR':
      return { ...state, rateLoading: false, rateError: action.payload };

    default:
      return state;
  }
}