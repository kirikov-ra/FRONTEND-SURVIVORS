import { EffectsBar } from "../EffectsBar/EffectsBar";
import { EventTimer } from "../EventTimer/EventTimer";
import { FullscreenButton } from "../FullscreenButton/FullscreenButton";
import { InfoBar } from "../InfoBar/InfoBar";
import { ItemsBar } from "../ItemsBar/ItemsBar";
import { LibraryButton } from "../LibraryButton/LibraryButton";
import { Map } from "../Map/Map"
import { RollHUD } from "../RollHUD/RollHUD";
import { SettingButton } from "../SettingButton/SettingButton";
import { Shop } from "../Shop/Shop";
import { SkillBar } from "../SkillBar/SkillBar";
import styles from "./HUD.module.scss"

export const HUD = () => {

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.buttons}>
                    <RollHUD />
                    <LibraryButton />
                    <SettingButton />
                    <FullscreenButton />
                </div>
                <EventTimer seconds={300} />
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