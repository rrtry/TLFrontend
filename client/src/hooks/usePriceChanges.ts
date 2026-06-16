import { useEffect, useReducer, useRef } from 'react';
import { fetchPriceChanges } from '../api/priceApi';
import { mapPriceChange } from '../mappers/priceChangeMapper';
import { dataReducer, initialDataState } from './dataReducer';
import type { PriceChange } from '../models/PriceChange';

export function usePriceChanges(from: string, to: string, period: number) {

  const [state, dispatch] = useReducer(dataReducer, initialDataState<PriceChange[]>([]));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const loadChanges = async () => {

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const signal = controller.signal;

      dispatch({ type: 'FETCH_START' });

      try {
        
        const now = new Date();
        const fromDateTime = new Date(now.getTime() - period * 60 * 1000).toISOString();
        const toDateTime = now.toISOString();

        const changes = await fetchPriceChanges(from, to, fromDateTime, toDateTime, signal);
        const mapped = changes.map(mapPriceChange);
        
        dispatch({ type: 'FETCH_SUCCESS', payload: mapped });

      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        dispatch({
          type: 'FETCH_ERROR',
          payload: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    };

    loadChanges();
    intervalRef.current = setInterval(loadChanges, 10_000);

    return () => {

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [from, to, period]);

  return state;
}