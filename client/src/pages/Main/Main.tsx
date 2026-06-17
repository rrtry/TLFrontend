import { useEffect, useState } from 'react';
import { useConverter } from '../../hooks/useConverter';
import { ExchangeRate } from '../../components/ExchangeRate/ExchangeRate';
import { ConversionPanel } from '../../components/ConversionPanel/ConversionPanel';
import { MoreAbout } from '../../components/MoreAbout/MoreAbout';
import { Toast } from '../../components/Toast/Toast';
import { RateChart } from '../../components/RateChart/RateChart';
import { PeriodSwitch } from '../../components/RateChart/PeriodSwitch';
import styles from './Main.module.scss';

export const Main = () => {
  const {
    from, to, amountInput, result, rate,
    setFrom, setTo, setAmount, swap,
    currencies, priceChanges, loading, error, rateLoading, rateError,
    period, setPeriod,
  } = useConverter();

  const fromCurrency = currencies.find(c => c.code === from);
  const toCurrency = currencies.find(c => c.code === to);
  const rateEntry = priceChanges.find(pc => pc.purchasedCurrencyCode === from && pc.paymentCurrencyCode === to);
  const dateTime = rateEntry
    ? new Date(rateEntry.dateTime).toUTCString()
    : 'Date is not specified';

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (rateError) {
      setToastMessage(rateError);
    }
  }, [rateError]);

  const dismissToast = () => setToastMessage(null);

  // Загрузка валют
  if (currencies.length === 0 && loading) {
    return <div className={styles.main}>Loading data...</div>;
  }

  // Ошибка загрузки валют
  if (currencies.length === 0 && error) {
    return (
      <div className={styles.main}>
        <div>Server error: {error}</div>
      </div>
    );
  }

  if (!fromCurrency || !toCurrency) {
    return <div className={styles.main}>Currency data unavailable.</div>;
  }

  const moreAboutKey = `${from}-${to}`;

  return (
    <div className={styles.main}>
        <div className={styles.card}>

          {toastMessage && <Toast message={toastMessage} onDismiss={dismissToast} />}

          <ExchangeRate
            fromAmount={1}
            fromCurrency={from}
            toAmount={rate}
            toCurrency={to}
            date={dateTime}
          />

          <div className={styles.columns}>
            <div className={styles.left}>
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
            </div>
            
            <div className={styles.right}>
              <PeriodSwitch period={period} onChange={setPeriod} />
              <RateChart
                data={priceChanges}
                loading={rateLoading}
                error={rateError}
              />
            </div>
          </div>

          <MoreAbout
            key={moreAboutKey}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
          />

      </div>
    </div>
  );
};