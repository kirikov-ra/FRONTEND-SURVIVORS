import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { ProjectileSystem } from "../systems/ProjectileSystem";

export class MainScene extends Phaser.Scene {
  public player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private projectileSystem!: ProjectileSystem;

  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("html", "assets/html.png");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000);

    this.player = new Player(
      this,
      this.scale.width / 2,
      this.scale.height / 2
    );

    this.player.setHpChangeCallback((hp) => {
      if ((window as any).setPlayerHp) {
        (window as any).setPlayerHp(hp);
      }
    });

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.projectileSystem = new ProjectileSystem(
      this,
      this.player,
      this.enemies
    );

    // столкновение игрок ↔ враги
    this.physics.add.collider(
      this.player,
      this.enemies,
      (_, enemy) => {
        (enemy as Enemy).tryDealDamage(this.player, this.time.now);
      }
    );

    // враги между собой
    this.physics.add.collider(this.enemies, this.enemies);

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.spawnEnemy,
      callbackScope: this,
    });
  }

  update(time: number, delta: number) {
    this.player.update();
    this.projectileSystem.update(time);
  }

  private spawnEnemy() {
    if (this.enemies.countActive(true) >= 20) return;

    const side = Phaser.Math.Between(0, 3);
    const w = this.scale.width;
    const h = this.scale.height;
    let x = 0, y = 0;

    switch (side) {
      case 0: x = -50; y = Phaser.Math.Between(0, h); break;
      case 1: x = w + 50; y = Phaser.Math.Between(0, h); break;
      case 2: x = Phaser.Math.Between(0, w); y = -50; break;
      case 3: x = Phaser.Math.Between(0, w); y = h + 50; break;
    }

    this.enemies.add(new Enemy(this, x, y, this.player));
  }
}
