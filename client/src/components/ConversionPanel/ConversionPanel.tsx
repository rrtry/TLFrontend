import styles from './ConversionPanel.module.scss';
import { ConversionRow } from './ConversionRow';

type ConversionPanelProps = {
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

        <ConversionRow
          currency={fromCurrency}
          amount={fromAmount}
        />

        <ConversionRow 
          currency={toCurrency}
          amount={toAmount}
        />
        
      </div>
    </div>
  );
};