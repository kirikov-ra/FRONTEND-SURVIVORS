import { useEffect, useState } from "react";
import styles from './EventTimer.module.scss'
import { GAME_EVENTS, gameEvents } from "../../../game/events/gameEvents";


export const EventTimer = () => {
    const [time, setTime] = useState({ minutes: 5, seconds: 0 });

    useEffect(() => {
        const handler = (t: { minutes: number; seconds: number }) => {
            setTime(t);
        };

        gameEvents.on(GAME_EVENTS.TIMER_TICK, handler);

        return () => {
            gameEvents.off(GAME_EVENTS.TIMER_TICK, handler);
        };
    }, []);


    return (
        <div className={styles.container}>
            <div className={styles.timer}>
                <p>
                    {String(time.minutes).padStart(2, '0')}
                    :
                    {String(time.seconds).padStart(2, '0')}
                </p>
            </div>
        </div>
    )
}