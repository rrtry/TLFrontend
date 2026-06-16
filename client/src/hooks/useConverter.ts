import { useReducer, useMemo, useEffect, useState } from 'react';
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

function converterReducer(
  state: ConverterState,
  action: ConverterAction
): ConverterState {
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

  const [converterState, converterDispatch] = useReducer(
    converterReducer,
    initialConverterState
  );

  const [currenciesState, currenciesDispatch] = useReducer(dataReducer, initialDataState<Currency[]>([]));
  const [priceChangesState, priceChangesDispatch] = useReducer(dataReducer, initialDataState<PriceChange[]>([]));
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

        const currencies: Currency[] = currenciesDto.map(mapCurrency);
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

  // Загрузка курса для текущей пары
  useEffect(() => {

    if (currenciesState.data.length === 0) {
      return;
    }

    let aborted = false;
    let controller: AbortController | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const loadHistory = async () => {
      // Отменяем предыдущий незавершённый запрос
      if (controller) {
        controller.abort();
      }

      controller = new AbortController();
      const signal = controller.signal;

      priceChangesDispatch({ type: 'FETCH_START' });

      try {

        const now = new Date();
        const fromDateTime = new Date(now.getTime() - period * 60 * 1000).toISOString();
        const toDateTime = now.toISOString();

        const dtos = await fetchPriceChanges(
          converterState.from,
          converterState.to,
          fromDateTime,
          toDateTime,
          signal
        );

        if (aborted) {
          return;
        }

        const mapped = dtos.map(mapPriceChange);
        priceChangesDispatch({ type: 'FETCH_SUCCESS', payload: mapped });

      } catch (err) {

        if (aborted || (err instanceof DOMException && err.name === 'AbortError')) {
          return;
        }

        priceChangesDispatch({
          type: 'FETCH_ERROR',
          payload: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    };

    // Первоначальная загрузка
    loadHistory();

    // Автообновление каждые 10 секунд
    intervalId = setInterval(loadHistory, 10_000);

    return () => {
      aborted = true;
      if (controller) controller.abort();
      if (intervalId) clearInterval(intervalId);
    };
  }, [converterState.from, converterState.to, currenciesState.data, period]);

  const setFrom = (code: string) => converterDispatch({ type: 'SET_FROM', code });
  const setTo = (code: string) => converterDispatch({ type: 'SET_TO', code });
  const setAmount = (value: string) => converterDispatch({ type: 'SET_AMOUNT', value });
  const swap = () => converterDispatch({ type: 'SWAP' });

  const rate = useMemo(() => {
    if (priceChangesState.data.length === 0) {
      return 0;
    }
    return priceChangesState.data[0].price;
  }, [priceChangesState.data]);

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
    currencies: currenciesState.data,
    priceChanges: priceChangesState.data,
    loading: currenciesState.loading,
    rateLoading: priceChangesState.loading,
    error: currenciesState.error,
    rateError: priceChangesState.error,
    period,
    setPeriod
  };
}