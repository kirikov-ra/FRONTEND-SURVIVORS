import { useEffect, useState } from "react";
import styles from "./Hp.module.scss"

export const Hp = () => {
    const [hp, setHp] = useState(100);

    useEffect(() => {
        window.setPlayerHp = setHp;

        return () => {
            delete window.setPlayerHp;
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.name}>HP</div>
            <div className={styles.scale_container}>
                <div
                    className={styles.scale}
                    style={{
                        width: `${hp}%`,
                    }}
                >
                </div>
                <span className={styles.text}>{hp} / 100</span>
            </div>
        </div>
    )
}