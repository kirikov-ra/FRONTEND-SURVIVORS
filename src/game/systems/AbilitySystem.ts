import Phaser from "phaser";
import { Player } from "../entities/Player";
// import { Enemy } from "../entities/Enemy";
import { AngularPentagram } from "../entities/AngularPentagram";
import { Trail } from "./CssTrailSkill";


export class AbilitySystem {
    private scene: Phaser.Scene;
    private player: Player;
    private enemies: Phaser.Physics.Arcade.Group;
    private pentagramOnCooldown = false;
    private readonly PENTAGRAM_CD = 30000;

    constructor(scene: Phaser.Scene, player: Player, enemies: Phaser.Physics.Arcade.Group) {
        this.scene = scene;
        this.player = player;
        this.enemies = enemies;

        // каст pentagram каждые 6 секунд
        this.scene.time.addEvent({
            delay: 6000,
            loop: true,
            callback: () => this.castAngularPentagram(),
        });
    }

    public update() {
        if (this.player.isInMotion()) {
            new Trail({
                scene: this.scene,
                x: this.player.x,
                y: this.player.y + 2,
                radius: 22,
                duration: 2000,
                dotDamage: 20,
                dotInterval: 200,
            });
        }
    }

    private castAngularPentagram() {
        if (this.pentagramOnCooldown) return;
        this.pentagramOnCooldown = true;

        new AngularPentagram(
            this.scene,
            this.player.x,
            this.player.y,
            this.enemies,
            { damage: 100, radius: 100 }
        );

        this.scene.time.delayedCall(this.PENTAGRAM_CD, () => {
            this.pentagramOnCooldown = false;
        });
    }
}
