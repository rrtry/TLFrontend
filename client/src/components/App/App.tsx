import { ExchangeRate } from '../ExchangeRate/ExchangeRate';
import { ConversionPanel } from '../ConversionPanel/ConversionPanel';
import { MoreAbout } from '../MoreAbout/MoreAbout.tsx';
import { exchangeRate, currencies } from '../../data/currencyData';
import styles from './App.module.scss';

function App() {

  const { from, to, rate, date } = exchangeRate;

  const fromCurrency = currencies[from];
  const fromAmount = 1;
  const toCurrency = currencies[to];
  const toAmount = rate;

  return (
    <div className={styles.app}>
      <main className={styles.container}>
  
        <ExchangeRate
          fromCurrency={from}
          toAmount={rate}
          fromAmount={fromAmount}
          toCurrency={to}
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

export default App;