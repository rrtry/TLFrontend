export type DataState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
}

export type DataAction<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; payload: string };

export function initialDataState<T>(initialData: T): DataState<T> {
  return {
    data: initialData,
    loading: false,
    error: null,
  };
}

export function dataReducer<T>(
  state: DataState<T>,
  action: DataAction<T>
): DataState<T> {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, data: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}