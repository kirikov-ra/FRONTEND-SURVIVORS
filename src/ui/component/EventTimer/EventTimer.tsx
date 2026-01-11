import { useEffect, useState } from "react";
import styles from './EventTimer.module.scss'

type CountdownProps = {
  seconds: number;
  onFinish?: () => void;
};


export const EventTimer = ({ seconds, onFinish }: CountdownProps) => {
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        if (timeLeft <= 0) {
        onFinish?.();
        return;
        }

        const timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onFinish]);

    const minutes = Math.floor(timeLeft / 60)
        .toString()
        .padStart(2, "0");

    const secs = (timeLeft % 60).toString().padStart(2, "0");


    return (
        <div className={styles.container}>
            <div className={styles.timer}>
                <p>{minutes}:{secs}</p>
            </div>
        </div>
    )
}