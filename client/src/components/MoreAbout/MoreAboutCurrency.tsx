import styles from './MoreAboutCurrency.module.scss';

type MoreAboutCurrencyProps = {
  code: string;
  name: string;
  symbol: string;
  description: string;
}

export const MoreAboutCurrency = ({ code, name, symbol, description }: MoreAboutCurrencyProps) => {
  return (
    <div className={styles.currencyInfo}>
      <h3 className={styles.title}>
        {name} - {code} - {symbol}
      </h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};