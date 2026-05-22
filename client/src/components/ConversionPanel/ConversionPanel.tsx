import styles from './ConversionPanel.module.scss';
import { currencies } from '../../mocks/currencies';

interface ConversionPanelProps {
  from: string;
  to: string;
  amount: number;
  result: number;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
  onAmountChange: (value: number) => void;
  onSwap: () => void;
}

const CurrencySelector = ({
  selectedCurrency,
  onChange,
  dataTestId,
}: {
  selectedCurrency: string;
  onChange: (code: string) => void;
  dataTestId: string
}) => {
  return (
    <div className={styles.customSelect}>
      <select 
        value={selectedCurrency} 
        onChange={(e) => onChange(e.target.value)}
        data-testid={dataTestId}>
        {currencies.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.code}
          </option>
        ))}
      </select>
    </div>
  );
};

const ConversionRow = ({
  amount,
  currency,
  editable,
  onAmountChange,
  onCurrencyChange,
}: {
  amount: number;
  currency: string;
  editable: boolean;
  onAmountChange?: (value: number) => void;
  onCurrencyChange: (code: string) => void;
}) => {
  return (
    <div className={styles.cell}>
      <input
        type="number"
        className={styles.amount}
        value={amount}
        onChange={(e) => editable && onAmountChange?.(parseFloat(e.target.value) || 0)}
        readOnly={!editable}
        disabled={!editable}
        data-testid={editable ? "amount-input" : "result-input"}
      />
      <div className={styles.separator}></div>
      <CurrencySelector 
        selectedCurrency={currency} 
        onChange={onCurrencyChange}
        dataTestId={editable ? 'from-select' : 'to-select'}
      />
    </div>
  );
};

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