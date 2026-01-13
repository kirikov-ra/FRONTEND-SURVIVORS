import { useEffect, useState } from "react";
import styles from "./RollHUD.module.scss";

type RollState = {
  current: number;
  max: number;
  progress: number; // 0..1
};

export function RollHUD() {
  const [state, setState] = useState<RollState>({
    current: 3,
    max: 3,
    progress: 0,
  });

  useEffect(() => {
    (window as any).setPlayerRollState = setState;
  }, []);

  const needsRecharge = state.current < state.max;

  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>
        <span className={styles.count}>{state.current}</span>

        {needsRecharge && (
          <div
            className={styles.cooldown}
            style={{
              transform: `scaleY(${1 - state.progress})`,
            }}
          />
        )}
      </div>
    </div>
  );
}
