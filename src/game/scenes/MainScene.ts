import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { ProjectileSystem } from "../systems/ProjectileSystem";
import { createPlayerAnimations } from "../animations/playerAnimations";
import { createEnemyAnimations } from "../animations/enemyAnimations";
import type { TextureKey } from "../types/TextureKey";

export class MainScene extends Phaser.Scene {
  public player!: Player;

  private enemies!: Phaser.Physics.Arcade.Group;
  private projectileSystem!: ProjectileSystem;

  private readonly MAP_WIDTH = 2000;
  private readonly MAP_HEIGHT = 2000;
  private readonly WALL_THICKNESS = 64;

  constructor() {
    super("MainScene");
  }

  preload(): void {
    this.load.image("html" satisfies TextureKey, "assets/html.png");
  }

  create(): void {
    //  ПОЛ
    const floor = this.add.tileSprite(
      0,
      0,
      this.MAP_WIDTH,
      this.MAP_HEIGHT,
      "floor"
    );
    floor.setOrigin(0, 0);

    //  ФИЗИКА МИРА
    this.physics.world.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);
    this.cameras.main.setBackgroundColor(0x000000);

    //  ИГРОК
    createPlayerAnimations(this.anims);

    this.player = new Player(
      this,
      this.MAP_WIDTH / 2,
      this.MAP_HEIGHT / 2
    );
    this.player.setDepth(2);

    //  КАМЕРА
    this.cameras.main.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // СТЕНЫ 
    const topWall = this.add.tileSprite(
      this.MAP_WIDTH / 2,
      this.WALL_THICKNESS / 2,
      this.MAP_WIDTH,
      this.WALL_THICKNESS,
      "wall_front"
    );
    topWall.setDepth(1);
    this.physics.add.existing(topWall, true);

    const topBody = topWall.body as Phaser.Physics.Arcade.StaticBody;
    topBody.setSize(this.MAP_WIDTH, this.WALL_THICKNESS - 62);

    const bottomWall = this.add.tileSprite(
      this.MAP_WIDTH / 2,
      this.MAP_HEIGHT - this.WALL_THICKNESS / 2,
      this.MAP_WIDTH,
      this.WALL_THICKNESS,
      "wall_front"
    );

    const leftWall = this.add.tileSprite(
      0,
      this.MAP_HEIGHT / 2,
      14,
      this.MAP_HEIGHT,
      "wall_side"
    );

    const rightWall = this.add.tileSprite(
      this.MAP_WIDTH,
      this.MAP_HEIGHT / 2,
      14,
      this.MAP_HEIGHT,
      "wall_side"
    );

    this.physics.add.existing(bottomWall, true);
    this.physics.add.existing(leftWall, true);
    this.physics.add.existing(rightWall, true);

    //  HP callback
    this.player.setHpChangeCallback((hp: number): void => {
      window.setPlayerHp?.(hp);
    });

    // ВРАГИ
    createEnemyAnimations(this.anims);

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.projectileSystem = new ProjectileSystem(
      this,
      this.player,
      this.enemies
    );

    //  КОЛЛИЗИИ
    this.physics.add.collider(this.player, topWall);
    this.physics.add.collider(this.player, bottomWall);
    this.physics.add.collider(this.player, leftWall);
    this.physics.add.collider(this.player, rightWall);

    this.physics.add.collider(
        this.player,
        this.enemies,
        (obj1, obj2): void => {
            if (obj2 instanceof Enemy && obj1 instanceof Player) {
                obj2.tryDealDamage(obj1, this.time.now);
            }
        }
    );

    this.physics.add.collider(this.enemies, this.enemies);

    // СПАВН 
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: this.spawnEnemy,
      callbackScope: this,
    });
  }

  update(time: number): void {
    this.player.update();
    this.projectileSystem.update(time);
  }

  private spawnEnemy(): void {
    if (this.enemies.countActive(true) >= 40) return;

    const side = Phaser.Math.Between(0, 3);
    const w = this.scale.width;
    const h = this.scale.height;

    let x = 0;
    let y = 0;

    switch (side) {
      case 0:
        x = -50;
        y = Phaser.Math.Between(0, h);
        break;
      case 1:
        x = w + 50;
        y = Phaser.Math.Between(0, h);
        break;
      case 2:
        x = Phaser.Math.Between(0, w);
        y = -50;
        break;
      case 3:
        x = Phaser.Math.Between(0, w);
        y = h + 50;
        break;
    }

    this.enemies.add(new Enemy(this, x, y, this.player));
  }
}
