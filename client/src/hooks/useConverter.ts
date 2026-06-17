import { useReducer, useMemo, useEffect, useState } from 'react';
import { fetchCurrencies } from '../api/currencyApi';
import { mapCurrency } from '../mappers/currencyMapper';
import { dataReducer, initialDataState } from './dataReducer';
import { usePriceChanges } from './usePriceChanges';
import type { Currency } from '../models/Currency';

type ConverterState = {
  from: string;
  to: string;
  amountInput: string;
}

type ConverterAction =
  | { type: 'SET_FROM'; code: string }
  | { type: 'SET_TO'; code: string }
  | { type: 'SET_AMOUNT'; value: string }
  | { type: 'SWAP' };

const initialConverterState: ConverterState = {
  from: 'CAD',
  to: 'PLN',
  amountInput: '1',
};

function converterReducer(state: ConverterState, action: ConverterAction): ConverterState {
  switch (action.type) {
    case 'SET_FROM':
      if (action.code === state.to) return { ...state, from: action.code, to: state.from };
      return { ...state, from: action.code };
    case 'SET_TO':
      if (action.code === state.from) return { ...state, to: action.code, from: state.to };
      return { ...state, to: action.code };
    case 'SET_AMOUNT':
      return { ...state, amountInput: action.value };
    case 'SWAP':
      return { ...state, from: state.to, to: state.from };
    default:
      return state;
  }
}

export function useConverter() {

  const [converterState, converterDispatch] = useReducer(converterReducer, initialConverterState);
  const [currenciesState, currenciesDispatch] = useReducer(dataReducer, initialDataState<Currency[]>([]));
  const [period, setPeriod] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const loadCurrencies = async () => {
      currenciesDispatch({ type: 'FETCH_START' });

      try {

        const currenciesDto = await fetchCurrencies();
        if (cancelled) {
          return;
        }

        const currencies = currenciesDto.map(mapCurrency);
        currenciesDispatch({ type: 'FETCH_SUCCESS', payload: currencies });

      } catch (err) {
        if (!cancelled) {
          currenciesDispatch({
            type: 'FETCH_ERROR',
            payload: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }
    };

    loadCurrencies();
    return () => { cancelled = true; };
  }, []);

  const priceChangesState = usePriceChanges(converterState.from, converterState.to, period);
  const rate = useMemo(() => {
    if (priceChangesState.data.length === 0) {
      return 0;
    }
    return priceChangesState.data[priceChangesState.data.length - 1].price;
  }, [priceChangesState.data]);

  const result = useMemo(() => {
    const parsed = parseFloat(converterState.amountInput);
    const numAmount = isNaN(parsed) ? 0 : Math.max(0.0, parsed);
    return Number((numAmount * rate).toFixed(4));
  }, [converterState.amountInput, rate]);

  const setFrom = (code: string) => converterDispatch({ type: 'SET_FROM', code });
  const setTo = (code: string) => converterDispatch({ type: 'SET_TO', code });
  const setAmount = (value: string) => converterDispatch({ type: 'SET_AMOUNT', value });
  const swap = () => converterDispatch({ type: 'SWAP' });

  return {
    from: converterState.from,
    to: converterState.to,
    amountInput: converterState.amountInput,
    result,
    rate,
    setFrom,
    setTo,
    setAmount,
    swap,
    currencies: currenciesState.data,
    priceChanges: priceChangesState.data,
    loading: currenciesState.loading,
    rateLoading: priceChangesState.loading,
    error: currenciesState.error,
    rateError: priceChangesState.error,
    period,
    setPeriod,
  };
}