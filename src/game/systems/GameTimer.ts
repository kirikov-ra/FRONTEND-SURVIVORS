import Phaser from "phaser";
import { gameEvents, GAME_EVENTS } from "../events/gameEvents";

export interface GameTimerConfig {
    scene: Phaser.Scene;
    bossTime: number; // время до спавна босса в секундах
    tickInterval?: number; // интервал обновления таймера (по умолчанию 1000)
}

export class GameTimer {
    private scene: Phaser.Scene;
    private bossTime: number;
    private elapsed = 0;
    private timerEvent!: Phaser.Time.TimerEvent;
    private tickInterval: number;

    constructor(config: GameTimerConfig) {
        this.scene = config.scene;
        this.bossTime = config.bossTime;
        this.tickInterval = config.tickInterval ?? 1000;

        this.start();
    }

    private start() {
        this.timerEvent = this.scene.time.addEvent({
            delay: this.tickInterval,
            loop: true,
            callback: this.updateTime,
            callbackScope: this
        });
    }

    private updateTime() {
        this.elapsed++;
        const remaining = Math.max(this.bossTime - this.elapsed, 0);
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        gameEvents.emit(GAME_EVENTS.TIMER_TICK, { minutes, seconds, raw: remaining });

        if (remaining === 0) {
            gameEvents.emit(GAME_EVENTS.SPAWN_BOSS);
            this.stop();
        }
    }

    public stop() {
        this.timerEvent?.remove(false);
    }

    public reset() {
        this.stop();
        this.elapsed = 0;
        this.start();
    }
}
