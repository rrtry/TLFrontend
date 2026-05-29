import { useMemo } from 'react';
import { useConverter } from '../../hooks/useConverter';
import { currencies } from '../../mocks/currencies';
import { priceChanges } from '../../mocks/priceChanges';
import { ExchangeRate } from '../../components/ExchangeRate/ExchangeRate';
import { ConversionPanel } from '../../components/ConversionPanel/ConversionPanel';
import { MoreAbout } from '../../components/MoreAbout/MoreAbout';
import styles from './Main.module.scss';

export const Main = () => {
  const {
    from, to, amount, result, rate,
    setFrom, setTo, setAmount, swap,
  } = useConverter();

  const fromCurrency = useMemo(
    () => currencies.find(c => c.code === from)!,
    [from]
  );

  const toCurrency = useMemo(
    () => currencies.find(c => c.code === to)!,
    [to]
  );

  const dateTime = useMemo(() => {
    const dt = priceChanges[from]?.[to]?.dateTime;
    return dt ? new Date(dt).toUTCString() : 'Date is not specified';
  }, [from, to]);

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
        amount={amount}
        result={result}
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