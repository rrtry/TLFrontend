import { useConverter } from '../../hooks/useConverter';
import { ExchangeRate } from '../../components/ExchangeRate/ExchangeRate';
import { ConversionPanel } from '../../components/ConversionPanel/ConversionPanel';
import { MoreAbout } from '../../components/MoreAbout/MoreAbout';
import styles from './Main.module.scss';

export const Main = () => {
  const {
    from, to, amountInput, result, rate,
    setFrom, setTo, setAmount, swap,
    currencies, priceChanges, loading, error, rateLoading,
  } = useConverter();

  const fromCurrency = currencies.find(c => c.code === from);
  const toCurrency = currencies.find(c => c.code === to);
  const rateEntry = priceChanges.find(pc => pc.purchasedCurrencyCode === from && pc.paymentCurrencyCode === to);

  const dateTime = rateEntry
    ? new Date(rateEntry.dateTime).toUTCString()
    : 'Date is not specified';

  if (currencies.length === 0 && loading) {
    return <div className={styles.main}>Loading data...</div>;
  }

  if (currencies.length === 0 && error) {
    return (
      <div className={styles.main}>
        <div>
          Server error: {error}
        </div>
      </div>
    );
  }
  
  if (!fromCurrency || !toCurrency) {
    return <div className={styles.main}>Currency data unavailable.</div>;
  }

  const moreAboutKey = `${from}-${to}`;

  return (
    <div className={styles.main}>
      <ExchangeRate
        fromAmount={1}
        fromCurrency={from}
        toAmount={rate}
        toCurrency={to}
        date={dateTime}
      />

      <ConversionPanel
        from={from}
        to={to}
        amountInput={amountInput}
        result={result}
        currencies={currencies}
        onFromChange={setFrom}
        onToChange={setTo}
        onAmountChange={setAmount}
        onSwap={swap}
      />

      <MoreAbout
        key={moreAboutKey}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
      />
    </div>
  );
};