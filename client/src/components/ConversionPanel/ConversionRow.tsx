import styles from './ConversionRow.module.scss';
import { currencies } from '../../data/currencyData';

type ConversionRowProps = {
  amount: number;
  currency: string;
}

export const ConversionRow = ({
    amount,
    currency,
}: ConversionRowProps) => {
  return (
    <div className={styles.cell}>
      <input
          type="number"
          className={styles.amount}
          value={amount}
        />
      <div className={styles.separator}></div>
      <div className={styles.customSelect}>
        <select value={currency}>
          {
            Object.values(currencies).map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))
          }
        </select>
      </div>
    </div>
  );
};