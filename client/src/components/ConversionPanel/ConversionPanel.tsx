import styles from './ConversionPanel.module.scss';
import { ConversionRow } from './ConversionRow.tsx';

type ConversionPanelProps = {
  from: string;
  to: string;
  amountInput: string;
  result: number;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
  onAmountChange: (value: string) => void;
  onSwap: () => void;
}

export const ConversionPanel = ({
  from,
  to,
  amountInput,
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
          amountInput={amountInput}
          currency={from}
          editable={true}
          onAmountChange={onAmountChange}
          onCurrencyChange={onFromChange}
        />

        <button 
          className={styles.swapButton} 
          onClick={onSwap}
          data-testid={"swap-button"}>
          Swap
        </button>

        <ConversionRow
          amountInput={String(result)}
          currency={to}
          editable={false}
          onCurrencyChange={onToChange}
        />
      </div>
    </div>
  );
};