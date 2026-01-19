import { useState } from 'react';
import { GAME_EVENTS, gameEvents } from '../../../game/events/gameEvents';
import { Settings } from '../Settings/Settings';
import styles from './SettingButton.module.scss';

export const SettingButton = () => {
  const [isActive, setIsActive] = useState(false);

  const toggle = () => {
    gameEvents.emit(GAME_EVENTS.TOGGLE_PAUSE);
    setIsActive(v => !v);
  };

  return (
    <>
      <div className={styles.container}>
        <button className={styles.button} onClick={toggle}>
          ⚙︎
        </button>
      </div>

      <Settings
        isActive={isActive}
        onClose={() => setIsActive(false)}
      />
    </>
  );
};


