import { useEffect, useState } from 'react'
import { Characteristic } from '../Characteristic/Characteristic'
import { Experience } from '../Experience/Experience'
import { Hp } from '../Hp/Hp'
import styles from './InfoBar.module.scss'

export const InfoBar = () => {
    const [speed, setSpeed] = useState(200);

    useEffect(() => {
        window.setPlayerSpeed = setSpeed;

        return () => {
            delete window.setPlayerSpeed;
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <Hp />
                <Experience />
                <Characteristic img={"assets/Boot.png"} value={speed}/>
                {/* dorabotac */}
                <Characteristic img={"assets/Shield.png"} value={1}/> 
                {/*  */}
            </div>
        </div>
    )
}