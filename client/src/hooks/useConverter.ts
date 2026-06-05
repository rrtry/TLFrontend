import { useReducer, useMemo } from 'react';
import { priceChanges } from '../mocks/priceChanges';

interface ConverterState {
  from: string;
  to: string;
  amountInput: string;
}

type Action =
  | { type: 'SET_FROM'; code: string }
  | { type: 'SET_TO'; code: string }
  | { type: 'SET_AMOUNT'; value: string }
  | { type: 'SWAP' };

const initialState: ConverterState = {
  from: 'CAD',
  to: 'PLN',
  amountInput: '1',
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
      return { ...state, amountInput: action.value };

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

  const setFrom = (code: string) => {
    dispatch({ type: 'SET_FROM', code });
  };

  const setTo = (code: string) => {
    dispatch({ type: 'SET_TO', code });
  };

  const setAmount = (value: string) => {
    dispatch({ type: 'SET_AMOUNT', value });
  };

  const swap = () => {
    dispatch({ type: 'SWAP' });
  };

  const rate = useMemo(() => {
    const fromPrices = priceChanges[state.from];
    
    if (!fromPrices || !fromPrices[state.to]) {
      return 0;
    }

    return fromPrices[state.to].price;
  }, [state.from, state.to]);

  const result = useMemo(() => {

    const parsed = parseFloat(state.amountInput);
    const numAmount = isNaN(parsed) ? 0 : Math.max(0.0, parsed);
    const fractionDigits = 4;
    
    return Number((numAmount * rate).toFixed(fractionDigits));

  }, [state.amountInput, rate]);

  return {
    from: state.from,
    to: state.to,
    amountInput: state.amountInput,
    result,
    setFrom,
    setTo,
    setAmount,
    swap,
    rate,
  };
}