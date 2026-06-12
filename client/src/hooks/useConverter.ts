import { useReducer, useMemo, useEffect } from 'react';
import { fetchCurrencies } from '../api/currencyApi';
import { fetchPriceChanges } from '../api/priceApi';
import { mapCurrency } from '../mappers/currencyMapper';
import { mapPriceChange } from '../mappers/priceChangeMapper';
import { dataReducer, initialDataState } from './dataReducer';
import type { Currency } from '../models/Currency';
import type { PriceChange } from '../models/PriceChange';

interface ConverterState {
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
      if (action.code === state.to) {
        return { ...state, from: action.code, to: state.from };
      }
      return { ...state, from: action.code };
    case 'SET_TO':
      if (action.code === state.from) {
        return { ...state, to: action.code, from: state.to };
      }
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
  const [dataState, dataDispatch] = useReducer(dataReducer, initialDataState);

  // 1. Загрузка списка валют
  useEffect(() => {
    let cancelled = false;

    const loadCurrencies = async () => {
      dataDispatch({ type: 'FETCH_START' });
      try {
        const currenciesDto = await fetchCurrencies();
        if (cancelled) return;

        const currencies: Currency[] = currenciesDto.map(mapCurrency);

        dataDispatch({
          type: 'FETCH_SUCCESS',
          payload: { currencies, priceChanges: [] }, // курсы пока пустые
        });
      } catch (err) {
        if (!cancelled) {
          dataDispatch({
            type: 'FETCH_ERROR',
            payload: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }
    };

    loadCurrencies();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Загрузка курса для выбранной пары валют
  useEffect(() => {
    // Ждём, пока загрузятся валюты, чтобы не делать запрос без кодов
    if (dataState.currencies.length === 0) {
      return;
    }

    let cancelled = false;
    const loadRate = async () => {
      dataDispatch({ type: 'FETCH_START' });
      try {

        const history = await fetchPriceChanges(converterState.from, converterState.to);
        if (cancelled) {
          return;
        }

        const priceChanges: PriceChange[] = [];
        if (history.length > 0) {
          const last = history[history.length - 1];
          priceChanges.push(mapPriceChange(last));
        }

        dataDispatch({
          type: 'FETCH_SUCCESS',
          payload: { currencies: dataState.currencies, priceChanges },
        });
      } catch (err) {
        if (!cancelled) {
          dataDispatch({
            type: 'FETCH_ERROR',
            payload: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }
    };

    loadRate();

    return () => {
      cancelled = true;
    };
  }, [converterState.from, converterState.to, dataState.currencies]);

  const setFrom = (code: string) => converterDispatch({ type: 'SET_FROM', code });
  const setTo = (code: string) => converterDispatch({ type: 'SET_TO', code });
  const setAmount = (value: string) => converterDispatch({ type: 'SET_AMOUNT', value });
  const swap = () => converterDispatch({ type: 'SWAP' });

  // Вычисление курса: теперь берём цену из первого (и единственного) элемента
  const rate = useMemo(() => {
    if (dataState.loading || dataState.error || dataState.priceChanges.length === 0) {
      return 0;
    }
    return dataState.priceChanges[0].price;
  }, [dataState.loading, dataState.error, dataState.priceChanges]);

  const result = useMemo(() => {
    const parsed = parseFloat(converterState.amountInput);
    const numAmount = isNaN(parsed) ? 0 : Math.max(0.0, parsed);
    return Number((numAmount * rate).toFixed(4));
  }, [converterState.amountInput, rate]);

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
    currencies: dataState.currencies,
    priceChanges: dataState.priceChanges,
    loading: dataState.loading,
    error: dataState.error,
  };
}