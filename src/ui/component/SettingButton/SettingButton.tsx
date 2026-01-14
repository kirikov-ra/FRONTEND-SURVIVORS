import { GAME_EVENTS, gameEvents } from '../../../game/events/gameEvents';
import styles from './SettingButton.module.scss';

export const SettingButton = () => {

  const handleClick = () => {
    gameEvents.emit(GAME_EVENTS.TOGGLE_PAUSE)
  };

  return (
    <div className={styles.container}>
        <button className={styles.button} onClick={handleClick}>
        ⚙︎
        </button>
    </div>
  );
};
