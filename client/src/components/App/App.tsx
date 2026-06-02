import { ExchangeRate } from '../ExchangeRate/ExchangeRate';
import { ConversionPanel } from '../ConversionPanel/ConversionPanel';
import { MoreAbout } from '../MoreAbout/MoreAbout.tsx';
import { exchangeRate, currencies } from '../../data/currencyData';
import styles from './App.module.scss';

export const App = () => {

  const { from, to, rate, date } = exchangeRate;
  const fromCurrency = currencies[from];
  const fromAmount  = 1;
  const toCurrency = currencies[to];
  const toAmount = rate;

  return (
    <div className={styles.app}>
      <main className={styles.container}>
  
        <ExchangeRate
          fromCurrency={fromCurrency.name}
          toAmount={rate}
          fromAmount={fromAmount}
          toCurrency={toCurrency.name}
          date={date}
        />

        <ConversionPanel
          fromCurrency={from}
          fromAmount={1}
          toCurrency={to}
          toAmount={toAmount}
        />

        <MoreAbout fromCurrency={fromCurrency} toCurrency={toCurrency}></MoreAbout>
      </main>
    </div>
  );
}