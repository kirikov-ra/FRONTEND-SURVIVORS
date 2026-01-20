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

    constructor({
    scene,
    x,
    y,
    radius = 20,
    duration = 2000,
    dotDamage = 1,
    dotInterval = 200,
}: TrailConfig) {
    super(scene, x, y, "trail_fire");

    // 1. Добавляем в сцену
    scene.add.existing(this);

    // 2. Добавляем физику **сразу**
    scene.physics.add.existing(this, true); // true = static body

    // 3. Настраиваем тело после добавления physics
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(22, 30);       // хитбокс меньше модели
    body.setOffset(0, 5);      // подстроить под центр спрайта

    // 4. Настройка спрайта
    this.play("trail_fire_anim");
    this.setDepth(1);
    this.setScale(radius / 20);
    this.setOrigin(0.5, 0.6);
    this.setDisplaySize(22, 55);

    this.duration = duration;
    this.dotDamage = dotDamage;
    this.dotInterval = dotInterval;

    // 5. Получаем группу врагов
    this.enemies = (scene as any).enemies;
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
