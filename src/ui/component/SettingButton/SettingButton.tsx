import styles from './SettingButton.module.scss';

export const SettingButton = () => {

  return (
    <div className={styles.container}>
        <button className={styles.button}>
        ⚙︎
        </button>
    </div>
  );
};
