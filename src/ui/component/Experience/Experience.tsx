// import { useEffect, useState } from "react";
import styles from "./Experience.module.scss"

export const Experience = () => {
    // const [Exp, setHp] = useState(100);
    // console.log(Exp)

    // useEffect(() => {
    //     window.setPlayerHp = setHp;
    // }, []);

    return (
        <div className={styles.container}>
            <div className={styles.name}>Exp</div>
            <div className={styles.scale_container}>
                <div
                    className={styles.scale}
                    style={{
                        width: `${100 - 24}%`,
                    }}
                >
                </div>
                <span className={styles.text}>{76} / ХЗ</span>
            </div>
        </div>
    )
}