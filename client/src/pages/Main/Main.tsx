import { useConverter } from '../../hooks/useConverter';
import { currencies } from '../../mocks/currencies';
import { priceChanges } from '../../mocks/priceChanges';
import { ExchangeRate } from '../../components/ExchangeRate/ExchangeRate';
import { ConversionPanel } from '../../components/ConversionPanel/ConversionPanel';
import { MoreAbout } from '../../components/MoreAbout/MoreAbout';
import styles from './Main.module.scss';

export const Main = () => {

  const {
    from, to, amount, result,
    setFrom, setTo, setAmount, swap, getRate,
  } = useConverter();

  const fromCurrency = currencies.find(c => c.code === from)!;
  const toCurrency = currencies.find(c => c.code === to)!;
  const rate = getRate();
  const dateTime = priceChanges[from]?.[to]?.dateTime
    ? new Date(priceChanges[from][to].dateTime).toUTCString()
    : 'Date is not specified';

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