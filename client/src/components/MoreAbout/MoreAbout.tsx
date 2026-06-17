import { useState } from 'react';
import type { Currency } from '../../models/Currency';
import { MoreAboutCurrency } from './MoreAboutCurrency'
import styles from './MoreAbout.module.scss';

type MoreAboutProps = {
  fromCurrency: Currency;
  toCurrency: Currency;
}

export const MoreAbout = ({ fromCurrency, toCurrency }: MoreAboutProps) => {

  const [moreAboutOpen, setMoreAboutOpen] = useState(false);
  
  return (
    <div>
      <div className={styles.separatorGrid}>
        <div className={styles.separatorLine}></div>
        <button className={styles.toggleButton} data-testid={"more-about-header"} onClick={() => setMoreAboutOpen(prev => !prev)}>
          More about {fromCurrency.code}/{toCurrency.code}
        </button>
        <div className={styles.separatorLine}></div>
      </div>

      { moreAboutOpen && (
        <>
          <MoreAboutCurrency currency={fromCurrency} />
          <MoreAboutCurrency currency={toCurrency} />
        </>
      )}
      
    </div>
  );
};