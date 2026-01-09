import Phaser from "phaser";

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  speed = 300;
  damage = 50;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "html");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);

    // ФИКСИРОВАННЫЙ ХИТБОКС
    const size = 14;
    this.setDisplaySize(size, size);
    body.setSize(size, size);
    body.setOffset(
      (this.width - size) / 2,
      (this.height - size) / 2
    );
  }

  fire(from: Phaser.Math.Vector2, to: Phaser.Math.Vector2) {
    this.setPosition(from.x, from.y);

    this.scene.physics.moveTo(this, to.x, to.y, this.speed);
  }
}
