import Phaser from "phaser";
import { Enemy } from "../entities/Enemy";

interface TrailConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    radius?: number;
    duration?: number;
    dotDamage?: number;
    dotInterval?: number;
}

export class Trail extends Phaser.GameObjects.Sprite {
    private duration: number;
    private elapsed = 0;
    private dotDamage: number;
    private dotInterval: number;
    private lastDotTime = 0;
    private enemies: Phaser.Physics.Arcade.Group;

    constructor({ scene, x, y, radius = 20, duration = 2000, dotDamage = 1, dotInterval = 200 }: TrailConfig) {
        super(scene, x, y, "trail_fire");
        scene.add.existing(this);
        this.play("trail_fire_anim");
        this.setDepth(1);
        this.setScale(radius / 20); // подгоняем под радиус (16 — половина кадра)
        this.setOrigin(0.5, 1);

        this.duration = duration;
        this.dotDamage = dotDamage;
        this.dotInterval = dotInterval;

        this.enemies = (scene as any).enemies;

        scene.physics.add.existing(this, true);
    }



    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        this.elapsed += delta;

        this.setAlpha(Phaser.Math.Clamp(1 - this.elapsed / this.duration, 0, 1));

        if (time > this.lastDotTime + this.dotInterval) {
            this.lastDotTime = time;

            const enemies = this.enemies.getChildren() as Enemy[];
            for (const enemy of enemies) {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                if (dist <= this.displayWidth / 2) {
                    enemy.takeDamage(this.dotDamage, "trail");
                }
            }
        }

        if (this.elapsed >= this.duration) {
            this.destroy();
        }
    }
}
