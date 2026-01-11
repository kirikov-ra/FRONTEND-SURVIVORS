import styles from './FullscreenButton.module.scss';

export const FullscreenButton = () => {
  const toggleFullscreen = () => {
    const root = document.getElementById('root');
    if (!root) return;

    if (!document.fullscreenElement) {
      root.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className={styles.container}>
        <button className={styles.button} onClick={toggleFullscreen}>
        ⛶
        </button>
    </div>
  );
};
