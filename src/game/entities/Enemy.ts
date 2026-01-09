import Phaser from "phaser";
import { Player } from "./Player";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private speed = 150;
  private target: Player;
  private hp = 100;
  private lastDamageTime = 0;
    private damageCooldown = 1000;

  constructor(scene: Phaser.Scene, x: number, y: number, target: Player) {
    super(scene, x, y, "enemy");
    this.target = target;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setSize(18, 24);
  }

  update() {
    this.scene.physics.moveToObject(this, this.target, this.speed);
  }

  takeDamage(amount: number) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.destroy();
    }
  }

    tryDealDamage(player: Player, time: number) {
        if (time < this.lastDamageTime + this.damageCooldown) return;
        this.lastDamageTime = time;
        player.takeDamage(1);
    }
}
