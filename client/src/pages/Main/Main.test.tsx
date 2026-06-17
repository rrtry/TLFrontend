import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Main } from './Main';
import { useConverter } from '../../hooks/useConverter';

vi.mock('../../hooks/useConverter');
vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

const baseCurrencies = [
  { code: 'CAD', name: 'Canadian dollar', description: 'CAD desc', symbol: '$' },
  { code: 'PLN', name: 'Polish zloty', description: 'PLN desc', symbol: 'zł' },
  { code: 'AUD', name: 'Australian dollar', description: 'AUD desc', symbol: '$' },
  { code: 'JPY', name: 'Japanese yen', description: 'JPY desc', symbol: '¥' },
  { code: 'ZAR', name: 'South African rand', description: 'ZAR desc', symbol: 'R' },
];

const defaultHookReturn = {
  from: 'CAD',
  to: 'PLN',
  amountInput: '1',
  result: 2.95,
  rate: 2.95,
  currencies: baseCurrencies,
  priceChanges: [
    {
      purchasedCurrencyCode: 'CAD',
      paymentCurrencyCode: 'PLN',
      price: 2.95,
      dateTime: '2026-01-01T00:00:00Z',
    },
  ],
  loading: false,
  rateLoading: false,
  error: null,
  rateError: null,
  setFrom: vi.fn(),
  setTo: vi.fn(),
  setAmount: vi.fn(),
  swap: vi.fn(),
  period: 1,
  setPeriod: vi.fn()
};

describe('Конвертер Main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useConverter).mockReturnValue(defaultHookReturn);
  });

  it('рендерит селекты и поля с данными', () => {
    render(<Main />);
    expect(screen.getByTestId('amount-input')).toHaveValue(1);
    expect(screen.getByTestId('result-input')).toBeInTheDocument();
    expect(screen.getByTestId('from-select')).toHaveValue('CAD');
    expect(screen.getByTestId('to-select')).toHaveValue('PLN');
    expect(screen.getByTestId('swap-button')).toBeInTheDocument();
  });

  it('отображает состояние загрузки', () => {
    vi.mocked(useConverter).mockReturnValue({
      ...defaultHookReturn,
      loading: true,
      currencies: [],
    });
    render(<Main />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке', () => {
    vi.mocked(useConverter).mockReturnValue({
      ...defaultHookReturn,
      loading: false,
      error: 'Server down',
      currencies: [],
    });
    render(<Main />);
    expect(screen.getByText(/server error: Server down/i)).toBeInTheDocument();
  });

  it('вызывает setAmount при изменении суммы', () => {
    const setAmount = vi.fn();
    vi.mocked(useConverter).mockReturnValue({
      ...defaultHookReturn,
      setAmount,
    });
    render(<Main />);
    const amountInput = screen.getByTestId('amount-input');
    fireEvent.change(amountInput, { target: { value: '10' } });
    expect(setAmount).toHaveBeenCalledWith('10');
  });

  it('отображает переданный результат и вызывает setFrom при смене валюты', () => {
    const setFrom = vi.fn();
    vi.mocked(useConverter).mockReturnValue({
      ...defaultHookReturn,
      setFrom,
      result: 2.95,
    });
    render(<Main />);
    expect(screen.getByTestId('result-input')).toHaveValue(2.95);

    const fromSelect = screen.getByTestId('from-select');
    fireEvent.change(fromSelect, { target: { value: 'AUD' } });
    expect(setFrom).toHaveBeenCalledWith('AUD');
  });

  it('при выборе одинаковой валюты вызывает setFrom и позволяет хуку обработать своп', () => {
    const setFrom = vi.fn();
    vi.mocked(useConverter)
      .mockReturnValueOnce({
        ...defaultHookReturn,
        setFrom,
        from: 'CAD',
        to: 'PLN',
      })
      .mockReturnValueOnce({
        ...defaultHookReturn,
        setFrom,
        from: 'PLN',
        to: 'CAD',
      });

    const { rerender } = render(<Main />);
    const fromSelect = screen.getByTestId('from-select');
    fireEvent.change(fromSelect, { target: { value: 'PLN' } });

    expect(setFrom).toHaveBeenCalledWith('PLN');
    rerender(<Main />);

    expect(screen.getByTestId('from-select')).toHaveValue('PLN');
    expect(screen.getByTestId('to-select')).toHaveValue('CAD');
  });

  it('сбрасывает состояние MoreAbout при смене пары (через key)', async () => {
    const setFrom = vi.fn();
    vi.mocked(useConverter)
      .mockReturnValueOnce({
        ...defaultHookReturn,
        setFrom,
        from: 'CAD',
        to: 'PLN',
        currencies: baseCurrencies,
      })
      .mockReturnValueOnce({
        ...defaultHookReturn,
        setFrom,
        from: 'AUD',
        to: 'PLN',
        currencies: baseCurrencies,
      });

    const { rerender } = render(<Main />);
    const moreAboutButton = screen.getByTestId('more-about-header');
    fireEvent.click(moreAboutButton);

    await waitFor(() => {
      expect(screen.getByTestId('description-CAD')).toBeInTheDocument();
      expect(screen.getByTestId('description-PLN')).toBeInTheDocument();
    });

    const fromSelect = screen.getByTestId('from-select');
    fireEvent.change(fromSelect, { target: { value: 'AUD' } });

    rerender(<Main />);

    await waitFor(() => {
      expect(screen.queryByTestId('description-CAD')).not.toBeInTheDocument();
      expect(screen.queryByTestId('description-PLN')).not.toBeInTheDocument();
      expect(screen.queryByTestId('description-AUD')).not.toBeInTheDocument();
    });
  });

  it('переключает видимость описаний валют при клике на More about', async () => {
    render(<Main />);

    const toggleButton = screen.getByTestId('more-about-header');

    expect(screen.queryByTestId('description-CAD')).not.toBeInTheDocument();
    expect(screen.queryByTestId('description-PLN')).not.toBeInTheDocument();

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByTestId('description-CAD')).toBeInTheDocument();
      expect(screen.getByTestId('description-PLN')).toBeInTheDocument();
    });

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.queryByTestId('description-CAD')).not.toBeInTheDocument();
      expect(screen.queryByTestId('description-PLN')).not.toBeInTheDocument();
    });
  });

  it('вызывает swap при клике на кнопку Swap', () => {
    const swap = vi.fn();
    vi.mocked(useConverter).mockReturnValue({
      ...defaultHookReturn,
      swap,
    });
    
    render(<Main />);

    const swapButton = screen.getByTestId('swap-button');
    fireEvent.click(swapButton);

    expect(swap).toHaveBeenCalledTimes(1);
  });

  // График
  it('отображает переключатель периода', () => {
    render(<Main />);
    expect(screen.getByTestId('period-switch')).toBeInTheDocument();
    expect(screen.getByTestId('period-1')).toHaveClass(/active/);
  });

  it('вызывает setPeriod при клике на период', () => {
    const setPeriod = vi.fn();
    vi.mocked(useConverter).mockReturnValue({
      ...defaultHookReturn,
      setPeriod,
    });
    render(<Main />);
    fireEvent.click(screen.getByTestId('period-3'));
    expect(setPeriod).toHaveBeenCalledWith(3);
  });

  it('отображает график с данными', () => {
    vi.mocked(useConverter).mockReturnValue({
      ...defaultHookReturn,
      priceChanges: [
        { purchasedCurrencyCode: 'CAD', paymentCurrencyCode: 'PLN', price: 2.95, dateTime: '2026-01-01T00:00:00Z' },
        { purchasedCurrencyCode: 'CAD', paymentCurrencyCode: 'PLN', price: 2.96, dateTime: '2026-01-01T00:00:10Z' },
      ],
    });
    render(<Main />);
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
  });

  it('отображает состояние загрузки графика', () => {
    vi.mocked(useConverter).mockReturnValue({
      ...defaultHookReturn,
      priceChanges: [],
      rateLoading: true,
    });
    render(<Main />);
    expect(screen.getByTestId('chart-loading')).toBeInTheDocument();
  });

  it('отображает ошибку графика при первой загрузке', () => {
    vi.mocked(useConverter).mockReturnValue({
      ...defaultHookReturn,
      priceChanges: [],
      rateError: 'Network error',
    });
    render(<Main />);
    expect(screen.getByTestId('chart-error')).toBeInTheDocument();
  });

  it('отображает сообщение о пустом графике', () => {
    vi.mocked(useConverter).mockReturnValue({
      ...defaultHookReturn,
      priceChanges: [],
    });
    render(<Main />);
    expect(screen.getByTestId('chart-empty')).toBeInTheDocument();
  });
});