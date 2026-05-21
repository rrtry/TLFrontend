import type { Currency } from '../../data/currencyData';
import styles from './MoreAbout.module.scss';

interface MoreAboutCurrencyProps {
  code: string;
  name: string;
  symbol: string;
  description: string;
}

interface MoreAboutProps {
  fromCurrency: Currency;
  toCurrency: Currency;
}

const MoreAboutCurrency = ({ code, name, symbol, description }: MoreAboutCurrencyProps) => {
  return (
    <div className={styles.currencyInfo}>
      <h3 className={styles.title}>
        {name} - {code} - {symbol}
      </h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export const MoreAbout = ({ fromCurrency, toCurrency }: MoreAboutProps) => {
  return (
    <div>
      <div className={styles.separatorGrid}>
        <div className={styles.separatorLine}></div>
        <div className={styles.separatorContent}>{`${fromCurrency.code}/${toCurrency.code}: about ↑`}</div>
        <div className={styles.separatorLine}></div>
      </div>
      <MoreAboutCurrency {...fromCurrency} />
      <MoreAboutCurrency {...toCurrency} />
    </div>
  );
};