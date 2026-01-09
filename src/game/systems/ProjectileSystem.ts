import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { Projectile } from "../entities/Projectile";

export class ProjectileSystem {
  private scene: Phaser.Scene;
  private player: Player;
  private enemies: Phaser.Physics.Arcade.Group;
  private projectiles: Phaser.Physics.Arcade.Group;

  private radius = 400;
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
      runChildUpdate: true,
    });

    // 🔥 КОЛЛАЙДЕР СНАРЯД ↔ ВРАГ
    // scene.physics.add.overlap(
    //   this.projectiles,
    //   this.enemies,
    //   this.handleHit as any,
    //   undefined,
    //   this
    // );
  }

  update(time: number) {
    if (time < this.lastShot + this.cooldown) return;

    const target = this.findClosestEnemy();
    if (!target) return;

    new Projectile(this.scene, this.player.x, this.player.y, target);
    this.lastShot = time;
  }

  private findClosestEnemy(): Enemy | null {
    let closest: Enemy | null = null;
    let minDist = this.radius;

    this.enemies.children.iterate((child) => {
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

