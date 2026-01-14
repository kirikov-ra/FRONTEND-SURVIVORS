import { useEffect, useState } from "react";
import { gameEvents, GAME_EVENTS } from "../../../game/events/gameEvents";
import styles from "./Map.module.scss";

type PlayerPos = {
  x: number;
  y: number;
  worldWidth: number;
  worldHeight: number;
};

export const Map = () => {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handler = (data: PlayerPos) => {
      const nx = data.x / data.worldWidth;
      const ny = data.y / data.worldHeight;

      setPos({
        x: Math.min(Math.max(nx, 0), 1),
        y: Math.min(Math.max(ny, 0), 1),
      });
    };

    gameEvents.on(GAME_EVENTS.PLAYER_POSITION, handler);
    return () => {
      gameEvents.off(GAME_EVENTS.PLAYER_POSITION, handler);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        <div className={styles.map}>
            <div>
                <div
                    className={styles.playerDot}
                    style={{
                    left: `${pos.x * 100}%`,
                    top: `${pos.y * 100}%`,
                    }}
                />
          </div>
        </div>
      </div>
    </div>
  );
};
