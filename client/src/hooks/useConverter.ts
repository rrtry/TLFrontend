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

  // Загружаем все валюты и курсы при первом рендере
  useEffect(() => {
    let cancelled = false;
    const loadAllData = async () => {
      dataDispatch({ type: 'FETCH_START' });
      try {

        // Список валют
        const currenciesDto = await fetchCurrencies();
        const currencies: Currency[] = currenciesDto.map(mapCurrency);
        
        if (cancelled) {
          return;
        }

        // Уникальные пары (кроме одинаковых кодов)
        const codes = currencies.map(c => c.code);
        const pairs: [string, string][] = [];
        
        for (const from of codes) {
          for (const to of codes) {
            if (from !== to) {
              pairs.push([from, to]);
            }
          }
        }

        // Запрашиваем курсы для каждой пары, извлекаем последнюю запись
        const pricePromises = pairs.map(([from, to]) => fetchPriceChanges(from, to));
        const results = await Promise.allSettled(pricePromises);
        const priceChanges: PriceChange[] = [];

        results.forEach((res) => {
          if (res.status === 'fulfilled' && res.value.length > 0) {
            const last = res.value[res.value.length - 1];
            priceChanges.push(mapPriceChange(last));
          }
        });

        if (!cancelled) {
          dataDispatch({
            type: 'FETCH_SUCCESS',
            payload: { currencies, priceChanges },
          });
        }
      } catch (err) {
        if (!cancelled) {
          dataDispatch({
            type: 'FETCH_ERROR',
            payload: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }
    };

    loadAllData();
    
    // cleanup
    return () => {
      cancelled = true;
    };

  }, []);

  const setFrom = (code: string) => converterDispatch({ type: 'SET_FROM', code });
  const setTo = (code: string) => converterDispatch({ type: 'SET_TO', code });
  const setAmount = (value: string) => converterDispatch({ type: 'SET_AMOUNT', value });
  const swap = () => converterDispatch({ type: 'SWAP' });

  // Вычисление курса из загруженного плоского массива
  const rate = useMemo(() => {
    if (dataState.loading || dataState.error) {
      return 0;
    }
    const entry = dataState.priceChanges.find(
      pc =>
        pc.purchasedCurrencyCode === converterState.from &&
        pc.paymentCurrencyCode === converterState.to
    );
    return entry?.price ?? 0;
  }, [dataState.priceChanges, dataState.loading, dataState.error, converterState.from, converterState.to]);

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

    // UI Data
    currencies: dataState.currencies,
    priceChanges: dataState.priceChanges,
    loading: dataState.loading,
    error: dataState.error,
  };
}