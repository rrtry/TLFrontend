import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RateChart } from './RateChart';
import type { PriceChange } from '../../models/PriceChange';

const mockData: PriceChange[] = [
  {
    purchasedCurrencyCode: 'CAD',
    paymentCurrencyCode: 'PLN',
    price: 2.95,
    dateTime: '2026-01-01T00:00:00Z',
  },
  {
    purchasedCurrencyCode: 'CAD',
    paymentCurrencyCode: 'PLN',
    price: 2.96,
    dateTime: '2026-01-01T00:00:10Z',
  },
];

describe('RateChart', () => {
  it('показывает loader при первой загрузке (loading=true, data=[])', () => {
    render(<RateChart data={[]} loading={true} error={null} />);

    expect(screen.getByTestId('chart-loading')).toBeInTheDocument();
    expect(screen.getByText('Loading chart...')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-container')).not.toBeInTheDocument();
  });

  it('показывает ошибку при первой загрузке (error, data=[])', () => {
    render(<RateChart data={[]} loading={false} error="Network error" />);

    expect(screen.getByTestId('chart-error')).toBeInTheDocument();
    expect(screen.getByText(/Error loading chart: Network error/i)).toBeInTheDocument();
    expect(screen.queryByTestId('chart-container')).not.toBeInTheDocument();
  });

  it('показывает сообщение о пустых данных при data=[] и отсутствии loading/error', () => {
    render(<RateChart data={[]} loading={false} error={null} />);

    expect(screen.getByTestId('chart-empty')).toBeInTheDocument();
    expect(screen.getByText('No data for selected period.')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-container')).not.toBeInTheDocument();
  });

  it('рендерит график при наличии данных (loading=false, error=null)', () => {
    render(<RateChart data={mockData} loading={false} error={null} />);

    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chart-error')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chart-empty')).not.toBeInTheDocument();
  });

  it('рендерит график со старыми данными, даже если loading=true', () => {
    render(<RateChart data={mockData} loading={true} error={null} />);

    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-loading')).not.toBeInTheDocument();
  });

  it('рендерит график со старыми данными при наличии ошибки', () => {
    render(<RateChart data={mockData} loading={false} error="Some error" />);

    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-error')).not.toBeInTheDocument();
  });
});