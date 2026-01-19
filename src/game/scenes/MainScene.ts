import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { ProjectileSystem } from "../systems/ProjectileSystem";
import { createPlayerAnimations } from "../animations/playerAnimations";
import { createEnemyAnimations } from "../animations/enemyAnimations";
import type { TextureKey } from "../../types/TextureKey";
import { gameEvents, GAME_EVENTS } from "../events/gameEvents";
import { Coin } from "../entities/Coin";
import { AngularPentagram } from "../entities/AngularPentagram";

export class MainScene extends Phaser.Scene {
    public player!: Player;
    private enemies!: Phaser.Physics.Arcade.Group;
    private projectileSystem!: ProjectileSystem;
    private escKey!: Phaser.Input.Keyboard.Key;
    coins!: Phaser.Physics.Arcade.Group;
  //  Карта
    private readonly MAP_WIDTH = 2000;
    private readonly MAP_HEIGHT = 2000;
    private readonly MIN_SPAWN_DISTANCE = 350;

    private gameTime = 0;          // в секундах
    private timerEvent!: Phaser.Time.TimerEvent;
    private readonly BOSS_TIME = 300; // 5 минут

    private pentagramOnCooldown = false;
    private readonly PENTAGRAM_CD = 30000; // 30 сек


    constructor() {
        super("MainScene");
    }

  /** Загружаем текстуры */
  preload(): void {
    this.load.image("floor" satisfies TextureKey, "assets/floor.png");
    this.load.image("wall_front" satisfies TextureKey, "assets/wall_front.png");
    this.load.image("wall_side" satisfies TextureKey, "assets/wall_side.png");
    this.load.image("wall_bottom" satisfies TextureKey, "assets/wall_bottom.png");
  }

  /** Создание сцены */
  create(): void {

    // timer
    this.timerEvent = this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
            this.gameTime++;

            const remaining = Math.max(this.BOSS_TIME - this.gameTime, 0);

            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;

            gameEvents.emit(GAME_EVENTS.TIMER_TICK, {
            minutes,
            seconds,
            raw: remaining,
            });

            if (remaining === 0) {
            gameEvents.emit(GAME_EVENTS.SPAWN_BOSS);
            this.timerEvent.remove(false); // остановить таймер
            }
        },
    });
    
    // pause
    this.escKey = this.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.ESC
    );

    gameEvents.on(GAME_EVENTS.NEW_GAME, this.restartGame, this);
    gameEvents.on(GAME_EVENTS.TOGGLE_PAUSE, this.togglePause, this);
    gameEvents.on(GAME_EVENTS.SPAWN_BOSS, this.spawnBoss, this);

// таймер не сбрасывается


    this.events.once(
        Phaser.Scenes.Events.SHUTDOWN,
        this.shutdown,
        this
    );
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
    this.cameras.main.setZoom(1.2);

    // ========================================================
    // СТЕНЫ
    // ========================================================
    const topWall = this.add.tileSprite(this.MAP_WIDTH / 2, 40, this.MAP_WIDTH, 80, "wall_front");
    topWall.setDepth(1);
    this.physics.add.existing(topWall, true);
    const topBody = topWall.body as Phaser.Physics.Arcade.StaticBody;
    topBody.setSize(this.MAP_WIDTH, 80 - 74);

    const bottomWall = this.add.tileSprite(this.MAP_WIDTH / 2, this.MAP_HEIGHT - 7, this.MAP_WIDTH, 14, "wall_bottom");
    bottomWall.setDepth(101);
    this.physics.add.existing(bottomWall, true);
    const bottomBody = bottomWall.body as Phaser.Physics.Arcade.StaticBody;
    bottomBody.setSize(this.MAP_WIDTH, 14);
    bottomBody.setOffset(0, 0);
    

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

    this.anims.create({
        key: "trail_fire_anim",
        frames: this.anims.generateFrameNumbers("trail_fire", { start: 0, end: 3 }),
        frameRate: 12,
        repeat: -1
    });

    this.time.addEvent({
        delay: 6000,
        loop: true,
        callback: this.castAngularPentagram,
        callbackScope: this,
    });

     this.anims.create({
        key: 'angular_pentagram_spawn',
        frames: this.anims.generateFrameNumbers('angular_pentagram_spawn', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: 0
    });

    this.anims.create({
        key: 'angular_pentagram_idle',
        frames: this.anims.generateFrameNumbers('angular_pentagram_idle', { start: 3, end: 3 }),
        frameRate: 1,
        repeat: -1
    });

    this.anims.create({
        key: 'angular_pentagram_explode',
        frames: this.anims.generateFrameNumbers('angular_pentagram_explode', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: 0
    });

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

    // this.physics.add.collider(this.enemies, this.enemies);


    this.coins = this.physics.add.group({
        classType: Coin,
        runChildUpdate: true,
    });
        
    this.physics.add.overlap(this.player, this.coins, (playerObj, coinObj) => {
        if (coinObj instanceof Coin && playerObj instanceof Player) {
            coinObj.collect(playerObj);
        }
    });

    // ========================================================
    // СПАВН ВРАГОВ
    // ========================================================
    this.time.addEvent({
      delay: 300,
      loop: true,
      callback: this.spawnEnemy,
      callbackScope: this,
    });
  }

  /** Обновление сцены */
    update(time: number): void {
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            gameEvents.emit(GAME_EVENTS.TOGGLE_PAUSE);
        }

        this.player.update(time);
        this.projectileSystem.update(time);
        this.player.enableHalo();

        const enemies = this.enemies.getChildren() as Enemy[];

        
        // СЕПАРАЦИЯ врагов
        for (const enemy of enemies) {
            enemy.applySeparation(enemies);
        }

        const player = this.player;
        gameEvents.emit(GAME_EVENTS.PLAYER_POSITION, {
            x: player.x,
            y: player.y,
            worldWidth: this.physics.world.bounds.width,
            worldHeight: this.physics.world.bounds.height,
        });

        

    }

    private spawnBoss() {
        console.log('BOSS SPAWNED');
        // this.enemies.add(new Boss(...))
    }

    private restartGame() {
        // 1. снять паузу
        this.scene.stop("PauseScene");

        // 2. перезапустить основную сцену
        this.scene.stop("MainScene");
        this.scene.start("MainScene");
    }

    private shutdown() {
        this.timerEvent?.remove(false);

        gameEvents.off(GAME_EVENTS.SPAWN_BOSS, this.spawnBoss, this);
        gameEvents.off(GAME_EVENTS.TOGGLE_PAUSE, this.togglePause, this);
        gameEvents.off(GAME_EVENTS.NEW_GAME, this.restartGame, this);
    }

    private togglePause() {
        if (this.scene.isPaused()) {
            this.scene.resume("MainScene");
            this.scene.stop("PauseScene");
        } else {
            this.scene.launch("PauseScene");
            this.scene.pause();
        }
    }

    private castAngularPentagram() {
        if (this.pentagramOnCooldown) return;

        this.pentagramOnCooldown = true;

        new AngularPentagram(
            this,
            this.player.x,
            this.player.y,
            this.enemies,
            {
            damage: 100,
            radius: 100,
            }
        );

        // кулдаун
        this.time.delayedCall(this.PENTAGRAM_CD, () => {
            this.pentagramOnCooldown = false;
        });
    }


  /** Спавн врага с случайной стороны карты */
  private spawnEnemy(): void {
    if (this.enemies.countActive(true) >= 100) return;

    const side = Phaser.Math.Between(0, 3);
    const w = this.scale.width;
    const h = this.scale.height;
    const margin = 64;

    let x = 0;
    let y = 0;

    let attempts = 0;

    do {
        switch (side) {
            case 0: // слева
                x = -margin;
                y = Phaser.Math.Between(0, h);
                break;
            case 1: // справа
                x = w + margin;
                y = Phaser.Math.Between(0, h);
                break;
            case 2: // сверху
                x = Phaser.Math.Between(0, w);
                y = -margin;
                break;
            case 3: // снизу
                x = Phaser.Math.Between(0, w);
                y = h + margin;
                break;
        }

        attempts++;

        // защита от бесконечного цикла
        if (attempts > 10) break;

    } while (
        Phaser.Math.Distance.Between(
            x,
            y,
            this.player.x,
            this.player.y
        ) < this.MIN_SPAWN_DISTANCE
    );

    this.enemies.add(new Enemy(this, x, y, this.player));
}

}
