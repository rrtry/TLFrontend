import styles from './ConversionPanel.module.scss';
import { ConversionRow } from './ConversionRow.tsx';

type ConversionPanelProps = {
  from: string;
  to: string;
  amount: number;
  result: number;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
  onAmountChange: (value: number) => void;
  onSwap: () => void;
}

export const ConversionPanel = ({
  from,
  to,
  amount,
  result,
  onFromChange,
  onToChange,
  onAmountChange,
  onSwap,
}: ConversionPanelProps) => {
  return (
    <div className={styles.panel}>
      <div className={styles.grid}>

        <ConversionRow
          amount={amount}
          currency={from}
          editable={true}
          onAmountChange={onAmountChange}
          onCurrencyChange={onFromChange}
        />

        <button 
          className={styles.swapButton} 
          onClick={onSwap}
          data-testid={"swap-button"}
          >
          Swap
        </button>

        <ConversionRow
          amount={result}
          currency={to}
          editable={false}
          onCurrencyChange={onToChange}
        />
      </div>
    </div>
  );
};