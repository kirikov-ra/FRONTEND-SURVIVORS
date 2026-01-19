import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";

export class EnemySpawner {
    private scene: Phaser.Scene;
    private player: Player;
    private group: Phaser.Physics.Arcade.Group;
    private minDistance: number;
    private maxEnemies: number = 100;
    private margin: number = 64;

    constructor(
        scene: Phaser.Scene,
        player: Player,
        group: Phaser.Physics.Arcade.Group,
        minDistance: number = 350
    ) {
        this.scene = scene;
        this.player = player;
        this.group = group;
        this.minDistance = minDistance;
    }

    /** Спавн одного врага с случайной стороны карты */
    spawn(): void {
        if (this.group.countActive(true) >= this.maxEnemies) return;

        const side = Phaser.Math.Between(0, 3);
        const w = this.scene.scale.width;
        const h = this.scene.scale.height;

        let x = 0;
        let y = 0;
        let attempts = 0;

        do {
            switch (side) {
                case 0: x = -this.margin; y = Phaser.Math.Between(0, h); break;
                case 1: x = w + this.margin; y = Phaser.Math.Between(0, h); break;
                case 2: x = Phaser.Math.Between(0, w); y = -this.margin; break;
                case 3: x = Phaser.Math.Between(0, w); y = h + this.margin; break;
            }

            attempts++;
            if (attempts > 10) break;
        } while (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < this.minDistance);

        this.group.add(new Enemy(this.scene, x, y, this.player));
    }
}
