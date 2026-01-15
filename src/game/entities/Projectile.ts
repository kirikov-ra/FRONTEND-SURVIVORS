import Phaser from "phaser";

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  speed = 300;
  damage = 5;

  // CSS-скилл
  bouncesLeft = 0;
  damageMultiplier = 1;

  // враги, в которых уже врезался
  private hitEnemies = new Set<Phaser.GameObjects.GameObject>();

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "html");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);

    // фиксированный хитбокс
    const size = 14;
    this.setDisplaySize(size, size);
    body.setSize(size, size);
    body.setOffset((this.width - size) / 2, (this.height - size) / 2);
  }

  fire(from: Phaser.Math.Vector2, to: Phaser.Math.Vector2) {
    this.setPosition(from.x, from.y);

    // сброс старых попаданий и velocity
    this.resetHits();
    const body = this.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.setVelocity(0, 0);
    }

    this.scene.physics.moveTo(this, to.x, to.y, this.speed);
  }

  public markHit(enemy: Phaser.GameObjects.GameObject) {
    this.hitEnemies.add(enemy);
  }

  public hasHit(enemy: Phaser.GameObjects.GameObject): boolean {
    return this.hitEnemies.has(enemy);
  }

  public resetHits() {
    this.hitEnemies.clear();
  }
}
