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
    ) as Projectile | undefined;
    if (!projectile) return;

    // === Настройка под уровень CSS-скилла ===
    const cssLevel = this.player.getSkillLevel?.("HTML") ?? 1;
    projectile.damage = 50;
    projectile.damageMultiplier = cssLevel >= 3 ? 2 : 1;
    projectile.bouncesLeft = cssLevel >= 4 ? 2 : cssLevel >= 2 ? 1 : 0;

    projectile.setActive(true);
    projectile.setVisible(true);

    // fire сразу с объектом цели
    projectile.fire(new Phaser.Math.Vector2(this.player.x, this.player.y),
        new Phaser.Math.Vector2(target.x, target.y));

    // Привязываем к текущему target, чтобы потом отскакивать
    (projectile as any).currentTarget = target;

    this.lastShot = time;
}


  private onHit(
    projectileGO: Phaser.GameObjects.GameObject,
    enemyGO: Phaser.GameObjects.GameObject
) {
    const projectile = projectileGO as Projectile;
    const enemy = enemyGO as Enemy;

    // если уже попал в этого врага, пропускаем
    if (projectile.hasHit(enemy)) return;

    // наносим урон
    enemy.takeDamage(projectile.damage * projectile.damageMultiplier, "projectile");

    // помечаем врага как поражённого
    projectile.markHit(enemy);

    if (projectile.bouncesLeft > 0) {
        projectile.bouncesLeft--;

        const nextTarget = this.findClosestEnemyTo(projectile, enemy);
        if (nextTarget) {
            // сброс hitEnemies для новой цели
            projectile.resetHits();

            const dir = new Phaser.Math.Vector2(
                nextTarget.x - projectile.x,
                nextTarget.y - projectile.y
            ).normalize();

            const body = projectile.body as Phaser.Physics.Arcade.Body | null;
            if (body) {
                body.velocity.set(dir.x * projectile.speed, dir.y * projectile.speed);
            }

            (projectile as any).currentTarget = nextTarget;
            return; // снаряд жив, идём к следующей цели
        }
    }

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

  private findClosestEnemyTo(projectile: Projectile, ignoreEnemy: Enemy): Enemy | null {
    let closest: Enemy | null = null;
    let minDist = this.radius;

    this.enemies.children.each((child) => {
      const enemy = child as Enemy;
      if (!enemy.active || enemy === ignoreEnemy) return true;

      const dist = Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y);
      if (dist < minDist) {
        minDist = dist;
        closest = enemy;
      }
      return true;
    });

    return closest;
  }
}
