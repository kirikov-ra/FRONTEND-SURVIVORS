import Phaser from "phaser";
import { GAME_EVENTS, gameEvents } from "../events/gameEvents";

export class Coin extends Phaser.Physics.Arcade.Sprite {
    private value: number;

    constructor(scene: Phaser.Scene, x: number, y: number, value = 1) {
        super(scene, x, y, "coin");
        this.value = value;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setAllowGravity(false);
        // body.setSize(10, 10);        
        this.setDisplaySize(14, 15);
        body.setOffset(0, 0);
        this.setDepth(1);

        // -----------------------------
        // Случайный импульс при спавне
        // -----------------------------
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const speed = Phaser.Math.FloatBetween(40, 80); // скорость разлета
        body.velocity.x = Math.cos(angle) * speed;
        body.velocity.y = Math.sin(angle) * speed;

        // Лёгкое замедление
        scene.tweens.add({
            targets: this,
            x: this.x + body.velocity.x * 0.3,
            y: this.y + body.velocity.y * 0.3,
            duration: 300,
            ease: "Quad.easeOut",
            onComplete: () => {
                body.velocity.set(0);
            },
        });
    }

    public collect() {
        gameEvents.emit(GAME_EVENTS.CURRENCY_UPDATED, { gold: this.value });
        this.disableBody(true, true);
        this.destroy();
    }
}
