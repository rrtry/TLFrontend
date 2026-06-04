import type { Currency } from '../../models/Currency';
import styles from './MoreAboutCurrency.module.scss';

export const MoreAboutCurrency = ({ currency }: { 
  currency: Currency;
}) => {
  return (
    <div className={styles.currencyInfo} data-testid={`description-${currency.code}`}>
      <h3 className={styles.title}>
        {currency.name} - {currency.code} - {currency.symbol}
      </h3>
      <p className={styles.description}>{currency.description}</p>
    </div>
  );
};