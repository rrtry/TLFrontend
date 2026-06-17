import styles from './PeriodSwitch.module.scss';

type PeriodSwitchProps = {
  period: number;
  onChange: (min: number) => void;
};

const periods = [1, 2, 3, 4, 5];

export const PeriodSwitch = ({ period, onChange }: PeriodSwitchProps) => {
  return (
    <div className={styles.switch} data-testid="period-switch">
      {periods.map(p => (
        <button
          key={p}
          className={`${styles.button} ${p === period ? styles.active : ''}`}
          onClick={() => onChange(p)}
          data-testid={`period-${p}`}
        >
          {p} MIN
        </button>
      ))}
    </div>
  );
};