import type { Currency } from '../../data/currencyData';
import { MoreAboutCurrency } from './MoreAboutCurrency'
import styles from './MoreAbout.module.scss';

type MoreAboutProps = {
  fromCurrency: Currency;
  toCurrency: Currency;
}

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