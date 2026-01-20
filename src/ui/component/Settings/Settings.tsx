import { createPortal } from "react-dom";
import styles from "./Settings.module.scss";
import { useState } from "react";
import Squares from "../Squares/Squares";
import { GAME_EVENTS, gameEvents } from "../../../game/events/gameEvents";

interface SettingsProps {
  onClose: () => void;
}

export const Settings = ({ onClose }: SettingsProps) => {
  const [confirmNewGame, setConfirmNewGame] = useState(false);

  const startNewGame = () => {
    // 1. Закрываем меню
    onClose();
    setConfirmNewGame(false)

    // 2. Снимаем паузу (если была)
    gameEvents.emit(GAME_EVENTS.TOGGLE_PAUSE, false);

    // 3. Запускаем рестарт
    gameEvents.emit(GAME_EVENTS.NEW_GAME);
  };

  return createPortal(
    <div className={styles.container}>
        <div className={styles.menu}>
            <h1>FRONTEND <br /> SURVIVORS</h1>
            <button className={styles.button} onClick={onClose}>
                Продолжить
            </button>
            {!confirmNewGame && (
            <button className={styles.button} onClick={() => setConfirmNewGame(true)}>
                Новая игра
            </button>
            )}
            {confirmNewGame && (
            <div className={styles.confirmNewGame}>
                <p>Подтвердить?</p>
                <button className={styles.button} onClick={startNewGame}>Да</button>
                <button className={styles.button} onClick={() => setConfirmNewGame(false)}>Нет</button>
            </div>
            )}
            <button className={styles.button} onClick={onClose}>
                Об игре
            </button>
        </div>
        <div className={styles.pers_avatar}>
            <img src="assets/pers_avatar.png" alt="Frontender avatar" />
        </div>
        <div className={styles.menu_background}>
        <Squares 
            speed={0.1}
            squareSize={40}
            direction="down"
            borderColor="#072108"
            hoverFillColor="#073b0d"
            />
        </div>
        {/* <img className={styles.menu_background} src="assets/menu_background.png" alt="menu background" /> */}
    </div>,
    document.body
  );
};
