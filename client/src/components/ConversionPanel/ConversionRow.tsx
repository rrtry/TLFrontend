import styles from './ConversionRow.module.scss';
import type { Currency } from '../../models/Currency';

type ConversionRowProps = {
  amountInput: string;
  currency: string;
  editable: boolean;
  currencies: Currency[];
  onAmountChange?: (value: string) => void;
  onCurrencyChange: (code: string) => void;
}

export const ConversionRow = ({
  amountInput, currency, editable, currencies,
  onAmountChange, onCurrencyChange,
}: ConversionRowProps) => {
  return (
    <div className={styles.cell}>
      <input
        type="number"
        className={styles.amount}
        value={amountInput}
        onChange={(e) => editable && onAmountChange?.(e.target.value)}
        readOnly={!editable}
        disabled={!editable}
        data-testid={editable ? "amount-input" : "result-input"}
      />
      <div className={styles.separator}></div>
      <div className={styles.customSelect}>
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          data-testid={editable ? 'from-select' : 'to-select'}
        >
          {currencies.map(c => (
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};