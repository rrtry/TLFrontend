import styles from './ConversionPanel.module.scss';

interface ConversionPanelProps {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
}

export const ConversionPanel = ({
    fromCurrency,
    fromAmount,
    toCurrency,
    toAmount
}: ConversionPanelProps) => {
  return (
    <div className={styles.panel}>
      <div className={styles.grid}>

        <div className={styles.cell}>
          <div className={styles.amount}>{fromAmount}</div>
          <div className={styles.separator}></div>
          <div className={styles.currency}>{fromCurrency}</div>
        </div>

        <div className={styles.cell}>
          <div className={styles.amount}>{toAmount}</div>
          <div className={styles.separator}></div>
          <div className={styles.currency}>{toCurrency}</div>
        </div>
      </div>
    </div>
  );
};