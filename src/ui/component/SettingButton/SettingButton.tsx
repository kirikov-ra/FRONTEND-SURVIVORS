import { useEffect, useState } from "react";
import { GAME_EVENTS, gameEvents } from "../../../game/events/gameEvents";
import { Settings } from "../Settings/Settings";
import styles from "./SettingButton.module.scss";

export const SettingButton = () => {
  const [isActive, setIsActive] = useState(false);

  // открытие/закрытие меню и синхронизация паузы
  const toggleMenu = () => {
    const opening = !isActive;
    setIsActive(opening);

    // пауза ставится при открытии меню, снимается при закрытии
    gameEvents.emit(GAME_EVENTS.TOGGLE_PAUSE, opening);
  };

  // подписка на событие ESC
  useEffect(() => {
    const handler = () => toggleMenu();
    gameEvents.on(GAME_EVENTS.TOGGLE_MENU, handler);

    return () => {
      gameEvents.off(GAME_EVENTS.TOGGLE_MENU, handler);
    };
  }, [isActive]);

  return (
    <>
      <div className={styles.container}>
        <button className={styles.button} onClick={toggleMenu}>
          ⚙︎
        </button>
      </div>

      <Settings
        isActive={isActive}
        onClose={() => {
          setIsActive(false);
          gameEvents.emit(GAME_EVENTS.TOGGLE_PAUSE, false);
        }}
      />
    </>
  );
};
