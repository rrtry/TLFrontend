import styles from './ExchangeRate.module.scss';

interface ExchangeRateProps {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  date: string;
}

export const ExchangeRate = ({
  fromAmount,
  fromCurrency,
  toAmount,
  toCurrency,
  date,
}: ExchangeRateProps) => {
  return (
    <div className={styles.rateCard}>
      <div className={styles.rateValue}>
        {fromAmount} {fromCurrency} is <strong>{toAmount}</strong> {toCurrency}
      </div>
      <div className={styles.date}>{date}</div>
    </div>
  );
};