import { useReducer, useMemo, useCallback } from 'react';
import { priceChanges } from '../mocks/priceChanges';

interface ConverterState {
  from: string;
  to: string;
  amount: number;
}

type Action =
  | { type: 'SET_FROM'; code: string }
  | { type: 'SET_TO'; code: string }
  | { type: 'SET_AMOUNT'; value: number }
  | { type: 'SWAP' };

const initialState: ConverterState = {
  from: 'CAD',
  to: 'PLN',
  amount: 1,
};

function reducer(state: ConverterState, action: Action): ConverterState {
  switch (action.type) {
    case 'SET_FROM':
      if (action.code === state.to) {
        return {
          ...state,
          from: action.code,
          to: state.from,
        };
      }
      return { ...state, from: action.code };

    case 'SET_TO':
      if (action.code === state.from) {
        return {
          ...state,
          to: action.code,
          from: state.to,
        };
      }
      return { ...state, to: action.code };

    case 'SET_AMOUNT':
      return { ...state, amount: action.value };

    case 'SWAP':
      return {
        ...state,
        from: state.to,
        to: state.from,
      };

    default:
      return state;
  }
}

export function useConverter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFrom = useCallback((code: string) => {
    console.log('setFrom: ' + code);
    dispatch({ type: 'SET_FROM', code });
  }, []);

  const setTo = useCallback((code: string) => {
    console.log('setTo: ' + code);
    dispatch({ type: 'SET_TO', code });
  }, []);

  const setAmount = useCallback((value: number) => {
    console.log('setAmount: ' + value);
    if (value > 0) {
      dispatch({ type: 'SET_AMOUNT', value });
    }
  }, []);

  const swap = useCallback(() => {
    console.log('swap: ');
    dispatch({ type: 'SWAP' });
  }, []);

  // Вычисляем курс и результат при изменении state
  const rate = useMemo(() => {
    const fromPrices = priceChanges[state.from];
    if (!fromPrices || !fromPrices[state.to]) {
      return 0;
    }
    console.log('rate: ' + fromPrices[state.to].price);
    return fromPrices[state.to].price;
  }, [state.from, state.to]);

  const result = useMemo(() => {
    console.log('result: ' + (state.amount * rate).toFixed(4));
    return Number((state.amount * rate).toFixed(4));
  }, [state.amount, rate]);

  return {
    from: state.from,
    to: state.to,
    amount: state.amount,
    result,
    setFrom,
    setTo,
    setAmount,
    swap,
    rate,
  };
}