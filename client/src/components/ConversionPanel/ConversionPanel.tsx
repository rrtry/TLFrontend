import styles from './ConversionPanel.module.scss';
import { currencies } from '../../data/currencyData';

interface ConversionPanelProps {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
}

interface CurrencySelectorProps {
  selectedCurrency: string;
}

interface ConversionRowProps {
  amount: number;
  currency: string;
  editable: boolean;
}

const CurrencySelector = ({
    selectedCurrency
}: CurrencySelectorProps) => {
  return (
    <div className={styles.customSelect}>
      <select value={selectedCurrency}>
        {
          Object.values(currencies).map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))
        }
      </select>
    </div>
  );
};

const ConversionRow = ({
    amount, 
    currency,
    editable
}: ConversionRowProps) => {
  return (
    <div className={styles.cell}>
      <input
          type="number"
          className={styles.amount}
          value={amount}
          onChange={(e) => editable ? e : e }
        />
      <div className={styles.separator}></div>
      <CurrencySelector selectedCurrency={currency}></CurrencySelector>
    </div>
  );
};

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
          editable={true}
        />

        <ConversionRow 
          currency={toCurrency}
          amount={toAmount}
          editable={false}
        />

      </div>
    </div>
  );
};