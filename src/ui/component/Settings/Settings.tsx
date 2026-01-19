import { createPortal } from 'react-dom';
import { GAME_EVENTS, gameEvents } from '../../../game/events/gameEvents';
import styles from './Settings.module.scss';
import { useState } from 'react';

type Props = {
  isActive: boolean;
  onClose: () => void;
};

export const Settings = ({ isActive, onClose }: Props) => {
  const [select, setSelect] = useState(false)
  
  if (!isActive) return null;

  const handleNewGame = () => {
    gameEvents.emit(GAME_EVENTS.NEW_GAME);
    gameEvents.emit(GAME_EVENTS.TOGGLE_PAUSE);
    onClose();
  };

  return createPortal(
    <div className={styles.container}>
      {!select &&
        <button className={styles.button} onClick={() => setSelect(true)}>
          Новая игра
        </button>
      }
      {select &&
        <>
            <p>Подтвердить</p>
            <button className={styles.button} onClick={handleNewGame}>
            Да
            </button>
            <button className={styles.button} onClick={() => setSelect(false)}>
            Нет
            </button>
        </>
      }
      <button className={styles.button}>
        Об игре
      </button>
    </div>,
    document.body
  );
};
