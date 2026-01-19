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
import { WorldBuilder } from "../world/WorldBuilder";
import { EnemySpawner } from "../systems/EnemySpawner";
import { GameTimer } from "../systems/GameTimer";

export class MainScene extends Phaser.Scene {
    public player!: Player;
    private enemies!: Phaser.Physics.Arcade.Group;
    private projectileSystem!: ProjectileSystem;
    private escKey!: Phaser.Input.Keyboard.Key;
    coins!: Phaser.Physics.Arcade.Group;

    // Размер карты
    private readonly MAP_WIDTH = 2000;
    private readonly MAP_HEIGHT = 2000;
    // private readonly PILLAR_OFFSET = 500;

    // Минимальное расстояние от игрока для спавна врага
    private readonly MIN_SPAWN_DISTANCE = 350;

    // Пентаграмма
    private pentagramOnCooldown = false;
    private readonly PENTAGRAM_CD = 30000;

    // Вспомогательные системы
    private enemySpawner!: EnemySpawner;
    private gameTimer!: GameTimer;

    constructor() {
        super("MainScene");
    }

    preload(): void {
        // Загрузка текстур
        this.load.image("floor" satisfies TextureKey, "assets/floor.png");
        this.load.image("wall_front" satisfies TextureKey, "assets/wall_front.png");
        this.load.image("wall_side" satisfies TextureKey, "assets/wall_side.png");
        this.load.image("wall_bottom" satisfies TextureKey, "assets/wall_bottom.png");
        this.load.image("pillar", "assets/pillar.png");
    }

    create(): void {
        
        

        // ===== Инициализация таймера через GameTimer =====
        this.gameTimer = new GameTimer({ scene: this, bossTime: 300 });

        // ===== Пауза и события игры =====
        this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        gameEvents.on(GAME_EVENTS.NEW_GAME, this.restartGame, this);
        gameEvents.on(GAME_EVENTS.TOGGLE_PAUSE, this.togglePause, this);
        gameEvents.on(GAME_EVENTS.SPAWN_BOSS, this.spawnBoss, this);
        

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

        // ===== Построение мира =====
        const worldBuilder = new WorldBuilder(this, this.MAP_WIDTH, this.MAP_HEIGHT);
        const { walls, pillars  } = worldBuilder.build();

        // ===== Создание игрока и анимаций =====
        createPlayerAnimations(this.anims);
        this.player = new Player(this, this.MAP_WIDTH / 2, this.MAP_HEIGHT / 2);

        // Колбэки для внешнего интерфейса
        this.player.setRollStateChangeCallback((state) => window.setPlayerRollState?.(state));
        this.player.setXpChangeCallback((xp) => window.setPlayerXp?.(xp));
        this.player.setHpChangeCallback((hp) => window.setPlayerHp?.(hp));
        this.player.setSpeedChangeCallback((speed) => window.setPlayerSpeed?.(speed));

        // Камера следует за игроком
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // ===== Коллизии игрока со стенами =====
        walls.forEach(wall => this.physics.add.collider(this.player, wall));

        // ===== Враги и система выстрелов =====
        createEnemyAnimations(this.anims);
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.projectileSystem = new ProjectileSystem(this, this.player, this.enemies);

        // ===== EnemySpawner для спавна врагов =====
        this.enemySpawner = new EnemySpawner(
            this,
            this.player,
            this.enemies,
            this.MIN_SPAWN_DISTANCE
        );

        // ===== Анимации и пентаграмма =====
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
            callbackScope: this
        });

        this.anims.create({ key: 'angular_pentagram_spawn', frames: this.anims.generateFrameNumbers('angular_pentagram_spawn', { start: 0, end: 3 }), frameRate: 4, repeat: 0 });
        this.anims.create({ key: 'angular_pentagram_idle', frames: this.anims.generateFrameNumbers('angular_pentagram_idle', { start: 3, end: 3 }), frameRate: 1, repeat: -1 });
        this.anims.create({ key: 'angular_pentagram_explode', frames: this.anims.generateFrameNumbers('angular_pentagram_explode', { start: 0, end: 3 }), frameRate: 12, repeat: 0 });

        // ===== Монеты =====
        this.coins = this.physics.add.group({ classType: Coin, runChildUpdate: true });
        this.physics.add.overlap(this.player, this.coins, (playerObj, coinObj) => {
            if (coinObj instanceof Coin && playerObj instanceof Player) coinObj.collect();
        });

        // ===== Спавн врагов через EnemySpawner =====
        this.time.addEvent({
            delay: 300,
            loop: true,
            callback: () => this.enemySpawner.spawn()
        });

        // ===== Коллизии игрок ↔ враги =====
        this.physics.add.collider(this.player, this.enemies, (obj1, obj2): void => {
            if (obj2 instanceof Enemy && obj1 instanceof Player) obj2.tryDealDamage(obj1, this.time.now);
        });

        // ========================================================
        // СТОЛБЫ
        // ========================================================
        pillars.forEach(pillar => {
            this.physics.add.collider(this.player, pillar);
            this.physics.add.collider(this.enemies, pillar);
        });
    }

    /** Обновление сцены */
    update(time: number): void {
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            gameEvents.emit(GAME_EVENTS.TOGGLE_MENU);
            gameEvents.emit(GAME_EVENTS.TOGGLE_PAUSE);
        }


        this.player.update(time);
        this.projectileSystem.update(time);
        this.player.enableHalo();

        // Раздвигаем врагов друг от друга
        const enemies = this.enemies.getChildren() as Enemy[];
        for (const enemy of enemies) enemy.applySeparation(enemies);

        // Отправляем позицию игрока для UI или миникарты
        gameEvents.emit(GAME_EVENTS.PLAYER_POSITION, {
            x: this.player.x,
            y: this.player.y,
            worldWidth: this.physics.world.bounds.width,
            worldHeight: this.physics.world.bounds.height,
        });
    }

    /** Спавн босса */
    private spawnBoss() { console.log('BOSS SPAWNED'); }

    /** Перезапуск игры */
    private restartGame() {
        this.scene.stop("PauseScene");
        this.scene.stop("MainScene");
        this.scene.start("MainScene");
    }

    /** Очистка событий при выключении сцены */
    private shutdown() {
        this.gameTimer?.stop(); // останавливаем таймер
        gameEvents.off(GAME_EVENTS.SPAWN_BOSS, this.spawnBoss, this);
        gameEvents.off(GAME_EVENTS.TOGGLE_PAUSE, this.togglePause, this);
        gameEvents.off(GAME_EVENTS.NEW_GAME, this.restartGame, this);
    }

    /** Включение/выключение паузы */
    private togglePause() {
        if (this.scene.isPaused()) { 
            this.scene.resume("MainScene"); 
            this.scene.stop("PauseScene"); 
        } else { 
            this.scene.launch("PauseScene"); 
            this.scene.pause(); 
        }
    }

    /** Каст пентаграммы */
    private castAngularPentagram() {
        if (this.pentagramOnCooldown) return;
        this.pentagramOnCooldown = true;

        new AngularPentagram(this, this.player.x, this.player.y, this.enemies, { damage: 100, radius: 100 });

        this.time.delayedCall(this.PENTAGRAM_CD, () => { this.pentagramOnCooldown = false; });
    }
}
