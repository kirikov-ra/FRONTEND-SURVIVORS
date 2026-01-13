import { useEffect, useState } from "react";
import styles from "./Experience.module.scss"

export const Experience = () => {
    const [xp, setXp] = useState(0);

    useEffect(() => {
        window.setPlayerXp = setXp;
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.name}>XP</div>
            <div className={styles.scale_container}>
                <div
                    className={styles.scale}
                    style={{
                        width: `${xp}%`,
                    }}
                >
                </div>
                <span className={styles.text}>{xp} / ХЗ</span>
            </div>
        </div>
    )
}