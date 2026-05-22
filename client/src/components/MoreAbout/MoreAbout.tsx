import { useState } from 'react';
import type { Currency } from '../../models/Currency';
import styles from './MoreAbout.module.scss';

interface MoreAboutProps {
  fromCurrency: Currency;
  toCurrency: Currency;
}

const MoreAboutCurrency = ({ currency, isOpen, onToggle }: { 
  currency: Currency; 
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  return (
    <div className={styles.currencyInfo}>
      <button 
        className={styles.toggleButton} 
        onClick={onToggle}
        data-testid={`toggle-${currency.code}`}>
        {isOpen ? '▼' : '▶'} {currency.name} ({currency.code}) – {currency.symbol}
      </button>
      {isOpen && (
        <p 
          className={styles.description}
          data-testid={`description-${currency.code}`}
        >
          {currency.description || 'Описание отсутствует.'}
        </p>
      )}
    </div>
  );
};

export const MoreAbout = ({ fromCurrency, toCurrency }: MoreAboutProps) => {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  return (
    <div>
      <div className={styles.separatorGrid}>
        <div className={styles.separatorLine}></div>
        <div className={styles.separatorContent} data-testid={"more-about-header"}>
          More about {fromCurrency.code}/{toCurrency.code}
        </div>
        <div className={styles.separatorLine}></div>
      </div>

      <MoreAboutCurrency
        currency={fromCurrency}
        isOpen={fromOpen}
        onToggle={() => setFromOpen(prev => !prev)}
      />
      <MoreAboutCurrency
        currency={toCurrency}
        isOpen={toOpen}
        onToggle={() => setToOpen(prev => !prev)}
      />
    </div>
  );
};