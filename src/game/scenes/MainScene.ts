import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { ProjectileSystem } from "../systems/ProjectileSystem";
import { createPlayerAnimations } from "../animations/playerAnimations";
import { createEnemyAnimations } from "../animations/enemyAnimations";
import type { TextureKey } from "../../types/TextureKey";

export class MainScene extends Phaser.Scene {
  public player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private projectileSystem!: ProjectileSystem;

  //  Карта
  private readonly MAP_WIDTH = 2000;
  private readonly MAP_HEIGHT = 2000;

  constructor() {
    super("MainScene");
  }

  /** Загружаем текстуры */
  preload(): void {
    this.load.image("html" satisfies TextureKey, "assets/html.png");
  }

  /** Создание сцены */
  create(): void {
    // ========================================================
    // ПОЛ
    // ========================================================
    const floor = this.add.tileSprite(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT, "floor");
    floor.setOrigin(0, 0);

    // ========================================================
    // ФИЗИКА МИРА
    // ========================================================
    this.physics.world.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);
    this.cameras.main.setBackgroundColor(0x000000);

    // ========================================================
    // ИГРОК
    // ========================================================
    createPlayerAnimations(this.anims);

    this.player = new Player(this, this.MAP_WIDTH / 2, this.MAP_HEIGHT / 2);
    this.player.setDepth(2);

    // Колбэк изменения состояния кувырка
    this.player.setRollStateChangeCallback((state): void => {
      window.setPlayerRollState?.(state);
    });

    // Колбэк изменения опыта
    this.player.setXpChangeCallback((xp: number): void => {
      window.setPlayerXp?.(xp);
    });

    // Колбэк изменения здоровья
    this.player.setHpChangeCallback((hp: number): void => {
      window.setPlayerHp?.(hp);
    });

    // Колбэк изменения скорости
    this.player.setSpeedChangeCallback((speed: number): void => {
      window.setPlayerSpeed?.(speed);
    });

    // ========================================================
    // КАМЕРА
    // ========================================================
    this.cameras.main.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // ========================================================
    // СТЕНЫ
    // ========================================================
    const topWall = this.add.tileSprite(this.MAP_WIDTH / 2, 40, this.MAP_WIDTH, 80, "wall_front");
    topWall.setDepth(1);
    this.physics.add.existing(topWall, true);
    const topBody = topWall.body as Phaser.Physics.Arcade.StaticBody;
    topBody.setSize(this.MAP_WIDTH, 80 - 74);

    const bottomWall = this.add.tileSprite(this.MAP_WIDTH / 2, this.MAP_HEIGHT - 7, this.MAP_WIDTH, 14, "wall_bottom");
    bottomWall.setDepth(4);
    this.physics.add.existing(bottomWall, true);
    const bottomBody = bottomWall.body as Phaser.Physics.Arcade.StaticBody;
    bottomBody.setSize(this.MAP_WIDTH, -14);

    const leftWall = this.add.tileSprite(14 / 2, this.MAP_HEIGHT / 2, 14, this.MAP_HEIGHT, "wall_side");
    leftWall.setDepth(3);
    this.physics.add.existing(leftWall, true);

    const rightWall = this.add.tileSprite(this.MAP_WIDTH - 6, this.MAP_HEIGHT / 2, 14, this.MAP_HEIGHT, "wall_side");
    rightWall.setDepth(3);
    rightWall.setRotation(3.14);
    this.physics.add.existing(rightWall, true);

    // ========================================================
    // ВРАГИ
    // ========================================================
    createEnemyAnimations(this.anims);

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.projectileSystem = new ProjectileSystem(this, this.player, this.enemies);

    // ========================================================
    // КОЛЛИЗИИ
    // ========================================================
    this.physics.add.collider(this.player, topWall);
    this.physics.add.collider(this.player, bottomWall);
    this.physics.add.collider(this.player, leftWall);
    this.physics.add.collider(this.player, rightWall);

    this.physics.add.collider(this.player, this.enemies, (obj1, obj2): void => {
      if (obj2 instanceof Enemy && obj1 instanceof Player) {
        obj2.tryDealDamage(obj1, this.time.now);
      }
    });

    this.physics.add.collider(this.enemies, this.enemies);

    // ========================================================
    // СПАВН ВРАГОВ
    // ========================================================
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: this.spawnEnemy,
      callbackScope: this,
    });
  }

  /** Обновление сцены */
  update(time: number): void {
    this.player.update(time);
    this.projectileSystem.update(time);
  }

  /** Спавн врага с случайной стороны карты */
  private spawnEnemy(): void {
    if (this.enemies.countActive(true) >= 40) return;

    const side = Phaser.Math.Between(0, 3);
    const w = this.scale.width;
    const h = this.scale.height;

    let x = 0;
    let y = 0;

    switch (side) {
      case 0: x = -50; y = Phaser.Math.Between(0, h); break; // слева
      case 1: x = w + 50; y = Phaser.Math.Between(0, h); break; // справа
      case 2: x = Phaser.Math.Between(0, w); y = -50; break; // сверху
      case 3: x = Phaser.Math.Between(0, w); y = h + 50; break; // снизу
    }

    this.enemies.add(new Enemy(this, x, y, this.player));
  }
}
