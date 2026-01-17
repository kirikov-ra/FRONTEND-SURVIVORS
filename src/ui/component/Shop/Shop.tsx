import { useEffect, useState } from "react";
import styles from "./Shop.module.scss";
import { GAME_EVENTS, gameEvents } from "../../../game/events/gameEvents";

export const Shop = () => {
    const [gold, setGold] = useState(0);

    useEffect(() => {
        const handler = (data: { gold: number }) => {
            // прибавляем к текущему значению
            setGold(prev => prev + data.gold);
        };

        gameEvents.on(GAME_EVENTS.CURRENCY_ADD + ":updated", handler);

        return () => {
            gameEvents.off(GAME_EVENTS.CURRENCY_ADD + ":updated", handler);
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.shop}>
                <button>{gold} <img src="/assets/coin_icon.png" alt="" /></button>
            </div>
        </div>
    );
};
