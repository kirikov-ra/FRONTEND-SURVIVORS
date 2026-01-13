import Phaser from "phaser";
import { Player } from "./Player";

type EnemyAnim = "enemy-walk";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    private speed = 150;
    private target: Player;
    private hp = 100;
    private lastDamageTime = 0;
    private damageCooldown = 500;
    private get bodyArcade(): Phaser.Physics.Arcade.Body {
        return this.body as Phaser.Physics.Arcade.Body;
    }

  constructor(scene: Phaser.Scene, x: number, y: number, target: Player) {
    super(scene, x, y, "enemy_sprite_sheet");

    this.target = target;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.bodyArcade;
    body.setAllowGravity(false);
    body.setSize(18, 20);
    body.setOffset(0, 2);
  }

  private playAnimation(key: EnemyAnim): void {
    if (this.anims.currentAnim?.key === key) return;
    this.play(key);
  }

  update(): void {
    this.scene.physics.moveToObject(this, this.target, this.speed);
    this.playAnimation("enemy-walk");
  }

  public takeDamage(amount: number): void {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.die();
    }
  }

  private die(): void {
    this.target.addExperience(1);
    this.destroy();
  }

  public tryDealDamage(player: Player, time: number): void {
    if (time < this.lastDamageTime + this.damageCooldown) return;

    this.lastDamageTime = time;
    player.takeDamage(1);
  }
}
