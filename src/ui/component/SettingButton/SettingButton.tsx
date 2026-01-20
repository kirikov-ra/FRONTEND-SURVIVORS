import { useEffect, useState } from "react";
import { GAME_EVENTS, gameEvents } from "../../../game/events/gameEvents";
import { Settings } from "../Settings/Settings";
import styles from "./SettingButton.module.scss";

export const SettingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    gameEvents.emit(GAME_EVENTS.MENU_SET, newState);
    gameEvents.emit(GAME_EVENTS.TOGGLE_PAUSE, newState);
  };

  // открытие/закрытие через ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleMenu();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <>
      <div className={styles.container}>
        <button className={styles.button} onClick={toggleMenu}>
          ⚙︎
        </button>
      </div>

      {isOpen && <Settings onClose={toggleMenu} />}
    </>
  );
};
