import { useEffect } from 'react';
import { useState } from 'react';
import styles from './ConversionRow.module.scss';
import { currencies } from '../../mocks/currencies';

type ConversionRowProps = {
  amount: number;
  currency: string;
  editable: boolean;
  onAmountChange?: (value: number) => void;
  onCurrencyChange: (code: string) => void;
}

export const ConversionRow = ({
  amount,
  currency,
  editable,
  onAmountChange,
  onCurrencyChange,
}: ConversionRowProps) => {

  const [inputValue, setInputValue] = useState<string>(String(amount));
  useEffect(() => {
    setInputValue(String(amount));
  }, [amount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const rawValue = e.target.value;
    setInputValue(rawValue);

    if (!editable) {
      return;
    }

    const numericValue = parseFloat(rawValue);
    const valueToSet = isNaN(numericValue) ? 0 : numericValue;

    onAmountChange?.(valueToSet);
  };

  return (
    <div className={styles.cell}>
      <input
        type="number"
        className={styles.amount}
        value={inputValue}
        onChange={handleInputChange}
        readOnly={!editable}
        disabled={!editable}
        data-testid={editable ? "amount-input" : "result-input"}
      />
      <div className={styles.separator}></div>
      <div className={styles.customSelect}>
        <select 
          value={currency} 
          onChange={(e) => onCurrencyChange(e.target.value)}
          data-testid={editable ? 'from-select' : 'to-select'}>
          {currencies.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.code}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};