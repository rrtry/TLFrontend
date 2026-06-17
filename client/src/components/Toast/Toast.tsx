import styles from './Toast.module.scss';

type ToastProps = {
  message: string;
  onDismiss: () => void;
};

export const Toast = ({ message, onDismiss }: ToastProps) => {
  return (
    <div className={styles.toast}>
      <span>{message}</span>
      <button className={styles.closeButton} onClick={onDismiss}>
        ✕
      </button>
    </div>
  );
};