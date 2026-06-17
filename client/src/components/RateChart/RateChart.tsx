import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PriceChange } from '../../models/PriceChange';
import styles from './RateChart.module.scss';

type RateChartProps = {
  data: PriceChange[];
  loading: boolean;
  error: string | null;
};

export const RateChart = ({ data, loading, error }: RateChartProps) => {

  if (loading && data.length === 0) {
    return <div className={styles.status} data-testid="chart-loading">Loading chart...</div>;
  }

  if (error && data.length === 0) {
    return <div className={styles.status} data-testid="chart-error">Error loading chart: {error}</div>;
  }

  if (data.length === 0) {
    return <div className={styles.status} data-testid="chart-empty">No data for selected period.</div>;
  }

  const chartData = data.map(point => ({
    time: new Date(point.dateTime).toLocaleString(),
    price: point.price,
  }));

  return (
    <div data-testid="chart-container" className={styles.chart}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={false} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line
            type="linear"
            dataKey="price"
            stroke="blue"
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};