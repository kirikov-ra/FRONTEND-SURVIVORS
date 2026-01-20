import { useEffect, useState } from "react";
import { EffectsBar } from "../EffectsBar/EffectsBar";
import { EventTimer } from "../EventTimer/EventTimer";
import { FullscreenButton } from "../FullscreenButton/FullscreenButton";
import { InfoBar } from "../InfoBar/InfoBar";
import { ItemsBar } from "../ItemsBar/ItemsBar";
import { LibraryButton } from "../LibraryButton/LibraryButton";
import { Map } from "../Map/Map";
import { SettingButton } from "../SettingButton/SettingButton";
import { Shop } from "../Shop/Shop";
import { SkillBar } from "../SkillBar/SkillBar";
import styles from "./HUD.module.scss";
import { GAME_EVENTS, gameEvents } from "../../../game/events/gameEvents";

export const HUD = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleMenuToggle = (isOpen: boolean) => {
            setIsVisible(!isOpen); // скрываем HUD, когда открыто меню
        };

        gameEvents.on(GAME_EVENTS.MENU_SET, handleMenuToggle);

        return () => {
            gameEvents.off(GAME_EVENTS.MENU_SET, handleMenuToggle);
        };
    }, []);

    return (
        <div 
            className={styles.container}
            style={{ display: isVisible ? "flex" : "none" }}
        >
            <div className={styles.top}>
                <div className={styles.buttons}>
                    <LibraryButton />
                    <SettingButton />
                    <FullscreenButton />
                </div>
                <EventTimer />
            </div>
            <div className={styles.bottom}>
                <Map />
                <div className={styles.info_container}>
                    <InfoBar />
                    <div>
                        <EffectsBar />
                        <SkillBar />
                    </div>
                    <ItemsBar />
                </div>
                <Shop />
            </div>
        </div>
    );
};

export default HUD;
