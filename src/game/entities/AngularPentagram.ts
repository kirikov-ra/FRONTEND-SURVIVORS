import Phaser from "phaser";
import { Enemy } from "./Enemy";

type Config = {
  damage: number;
  radius: number;
};

/** Жизненный цикл пентаграммы */
type PentagramLifecycle = "spawning" | "active" | "exploding" | "dead";

const TIMINGS = {
  ACTIVE_MS: 5000,
};

const ANIMS = {
  SPAWN: "angular_pentagram_spawn",
  IDLE: "angular_pentagram_idle",
  EXPLODE: "angular_pentagram_explode",
} as const;

export class AngularPentagram extends Phaser.GameObjects.Sprite {
  private readonly enemies: Phaser.Physics.Arcade.Group;
  private readonly damage: number;
  private readonly radius: number;

  private lifecycle: PentagramLifecycle = "spawning";

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemies: Phaser.Physics.Arcade.Group,
    config: Config
  ) {
    super(scene, x, y, "Angular_pentagram");

    this.enemies = enemies;
    this.damage = config.damage;
    this.radius = config.radius;

    scene.add.existing(this);

    this.setOrigin(0.5);
    this.setDepth(0);

    this.startSpawn();
  }

  // =========================================================
  // LIFECYCLE
  // =========================================================

  private startSpawn(): void {
    this.lifecycle = "spawning";

    this.play(ANIMS.SPAWN);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + ANIMS.SPAWN,
      () => this.startActive()
    );
  }

  private startActive(): void {
    if (this.lifecycle !== "spawning") return;

    this.lifecycle = "active";

    this.play(ANIMS.IDLE, true);

    this.scene.time.delayedCall(
      TIMINGS.ACTIVE_MS,
      () => this.startExplosion()
    );
  }

  private startExplosion(): void {
    if (this.lifecycle !== "active") return;

    this.lifecycle = "exploding";

    this.play(ANIMS.EXPLODE);

    // урон строго один раз
    this.dealDamage();

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + ANIMS.EXPLODE,
      () => this.destroySelf()
    );
  }

  private destroySelf(): void {
    this.lifecycle = "dead";
    this.destroy();
  }

  // =========================================================
  // DAMAGE
  // =========================================================

  private dealDamage(): void {
    const enemies = this.enemies.getChildren() as Enemy[];

    for (const enemy of enemies) {
      if (!enemy.active) continue;

      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        enemy.x,
        enemy.y
      );

      if (distance <= this.radius + 100) {
        enemy.takeDamage(this.damage);
      }
    }
  }
}
