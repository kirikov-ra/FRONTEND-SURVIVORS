import Phaser from "phaser";
import { Enemy } from "./Enemy";

export class Projectile extends Phaser.Physics.Arcade.Sprite  {
  private speed = 300;
  private target: Enemy;

  constructor(scene: Phaser.Scene, x: number, y: number, target: Enemy) {
    super(scene, x, y, "html");
    this.target = target;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);

    this.setDisplaySize(16, 16);        // визуальный размер
    body.setSize(16, 16);               // хитбокс

    scene.physics.moveToObject(this, target, this.speed);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.target.active) {
      this.destroy();
      return;
    }

    const dist = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.target.x,
      this.target.y
    );

    if (dist < 12) {
      this.target.takeDamage(50);
      this.destroy();
    }
  }
}
