import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { Projectile } from "../entities/Projectile";

export class ProjectileSystem {
  private scene: Phaser.Scene;
  private player: Player;
  private enemies: Phaser.Physics.Arcade.Group;
  private projectiles: Phaser.Physics.Arcade.Group;

  private radius = 200;
  private cooldown = 600;
  private lastShot = 0;

  constructor(
    scene: Phaser.Scene,
    player: Player,
    enemies: Phaser.Physics.Arcade.Group
  ) {
    this.scene = scene;
    this.player = player;
    this.enemies = enemies;

    this.projectiles = scene.physics.add.group({
      classType: Projectile,
      runChildUpdate: false,
    });

    // ГЛАВНОЕ МЕСТО
    scene.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.onHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  update(time: number) {
    if (time < this.lastShot + this.cooldown) return;

    const target = this.findClosestEnemy();
    if (!target) return;

    const projectile = this.projectiles.get(
      this.player.x,
      this.player.y
    ) as Projectile;

    if (!projectile) return;

    projectile.setActive(true);
    projectile.setVisible(true);

    projectile.fire(
      new Phaser.Math.Vector2(this.player.x, this.player.y),
      new Phaser.Math.Vector2(target.x, target.y)
    );

    this.lastShot = time;
  }

  private onHit(
    projectileGO: Phaser.GameObjects.GameObject,
    enemyGO: Phaser.GameObjects.GameObject
  ) {
    const projectile = projectileGO as Projectile;
    const enemy = enemyGO as Enemy;

    enemy.takeDamage(projectile.damage);
    projectile.destroy();
  }

  private findClosestEnemy(): Enemy | null {
    let closest: Enemy | null = null;
    let minDist = this.radius;

    this.enemies.children.each((child) => {
      const enemy = child as Enemy;
      if (!enemy.active) return true;

      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y
      );

      if (dist < minDist) {
        minDist = dist;
        closest = enemy;
      }
      return true;
    });

    return closest;
  }
}
