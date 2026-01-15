import Phaser from "phaser";
import type { MovementKeys } from "../../types/Input";
import { Trail } from "../systems/CssTrailSkill";

type PlayerAnim = "player-idle" | "player-walk" | "player-hit" | "player-roll";

type RollState = {
  current: number;
  max: number;
  progress: number; // 0..1
};

const HALO_OFFSET_Y = -46;

export class Player extends Phaser.Physics.Arcade.Sprite {
    public hp: number;
    public maxHp: number;
    public xp = 0;
    private speed = 200;
    private isHit = false;
    private hitCooldownMs = 300;
    private hitTimer?: Phaser.Time.TimerEvent;
    private halo: Phaser.GameObjects.Sprite;

    // roll config
    private readonly ROLL_SPEED = 350;
    private readonly ROLL_DURATION = 300;
    private readonly ROLL_COOLDOWN = 400;
    private readonly MAX_ROLL_CHARGES = 99;
    private readonly ROLL_RECHARGE_TIME = 30000;

    // state
    private isMoving = false;
    private isRolling = false;
    private rollDir = new Phaser.Math.Vector2(1, 0);

    private rollCharges = this.MAX_ROLL_CHARGES;
    private lastRollTime = 0;
    private lastChargeTime = 0; 

    private onRollStateChange?: (state: RollState) => void;
    private onXpChange?: (xp: number) => void;
    private onHpChange?: (hp: number) => void;
    private onSpeedChange?: (speed: number) => void;

    private spaceKey: Phaser.Input.Keyboard.Key;

    private keys: MovementKeys;
    private get bodyArcade(): Phaser.Physics.Arcade.Body {
      return this.body as Phaser.Physics.Arcade.Body;
    }

    private lastTrailTime = 0;
    private trailCooldown = 100;


    // уровень каждого скилла (по умолчанию 1)
    private skillLevels: Record<string, number> = {
        CSS: 4,
        HTML: 1,
        JS: 1,
        // добавь другие скиллы
    };

    // метод для получения уровня скилла
    public getSkillLevel(skillName: string): number {
        return this.skillLevels[skillName] ?? 1;
    }

    // метод для повышения уровня скилла
    public setSkillLevel(skillName: string, level: number) {
        this.skillLevels[skillName] = level;
    }

    private playAnimation(key: PlayerAnim) {
      if (this.anims.currentAnim?.key === key) return;
      this.play(key);
    }

    private updateMovement() {
        const body = this.bodyArcade;
        body.setVelocity(0);

        if (this.keys.W.isDown) body.setVelocityY(-this.speed);
        if (this.keys.S.isDown) body.setVelocityY(this.speed);
        if (this.keys.A.isDown) body.setVelocityX(-this.speed);
        if (this.keys.D.isDown) body.setVelocityX(this.speed);

        body.velocity.normalize().scale(this.speed);

        this.isMoving = body.velocity.lengthSq() > 0;

        if (body.velocity.lengthSq() > 0) {
            this.rollDir.copy(body.velocity).normalize();
        }
    }

    private updateAnimation() {
        if (this.isHit) return;

        const body = this.bodyArcade;

        if (body.velocity.lengthSq() > 0) {
            const isFlipped = body.velocity.x < 0;

            this.flipX = isFlipped;
            this.halo.setFlipX(isFlipped); // ← ВОТ ЭТО

            this.playAnimation("player-walk");
        } else {
            this.playAnimation("player-idle");
        }
    }

    private tryRoll(time: number): void {
        if (this.isRolling) return;
        if (this.rollCharges <= 0) return;
        if (time < this.lastRollTime + this.ROLL_COOLDOWN) return;
        if (this.rollDir.lengthSq() === 0) return;

        this.isRolling = true;
        this.rollCharges--;
        this.lastRollTime = time;

        const body = this.bodyArcade;

        body.setVelocity(
            this.rollDir.x * this.ROLL_SPEED,
            this.rollDir.y * this.ROLL_SPEED
        );

        this.play("player-roll", true);

        this.scene.time.delayedCall(this.ROLL_DURATION, () => {
            this.isRolling = false;
            body.setVelocity(0);
        });
    }

    private updateRollRecharge(time: number): void {
        if (this.rollCharges >= this.MAX_ROLL_CHARGES) return;

        if (this.lastChargeTime === 0) {
            this.lastChargeTime = time;
        }

        const progress =
            (time - this.lastChargeTime) / this.ROLL_RECHARGE_TIME;

        if (progress >= 1) {
            this.rollCharges++;
            this.lastChargeTime = 0;
        }
    }

    private getRollProgress(time: number): number {
        if (this.rollCharges >= this.MAX_ROLL_CHARGES) return 0;
        if (this.lastChargeTime === 0) return 0;

        return Phaser.Math.Clamp(
            (time - this.lastChargeTime) / this.ROLL_RECHARGE_TIME,
            0,
            1
        );
    }

    private spawnCssTrail(time: number) {
        if (time < this.lastTrailTime + this.trailCooldown) return;
        this.lastTrailTime = time;

        new Trail({
            scene: this.scene,
            x: this.x,
            y: this.y + 2,
            radius: 22,
            duration: 2000,
            dotDamage: 20,
            dotInterval: 200,
        });
    }


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "player_asset_sheet", 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.bodyArcade;
        body.setSize(19, 28);
        body.setOffset(2, 4);
        body.setCollideWorldBounds(true);
        body.setImmovable(false);
        body.setAllowGravity(false);
        this.setDisplaySize(25, 72);
        // this.bodyArcade.pushable = false;
        this.hp = 100;
        this.maxHp = 100;
        this.setDepth(100);


        this.keys = scene.input.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
        }) as MovementKeys;

        this.spaceKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        // === НИМБ ===
        this.halo = scene.add.sprite(x, y + HALO_OFFSET_Y, "ts_halo");
        this.halo.setVisible(false);
        this.halo.setDepth(this.depth + 1);
    }

    public setHpChangeCallback(cb: (hp: number) => void): void {
        this.onHpChange = cb;
    }
    // =============================================================== dorabotac
    public setSpeedChangeCallback(cb: (speed: number) => void): void {
        this.onSpeedChange = cb;
    }

    public setRollStateChangeCallback(cb: (state: RollState) => void): void {
        this.onRollStateChange = cb;
    }

    public setXpChangeCallback(cb: (xp: number) => void): void {
        this.onXpChange = cb;
    }

    public addExperience(amount: number): void {
        this.xp += amount;
        this.onXpChange?.(this.xp);
    }

    // public setSpeed(speed: number): void {
    //     if (this.speed === speed) return;
    //     this.speed = speed;
    //     this.onSpeedChange?.(this.speed);
    // }

    // public getSpeed(): number {
    //     return this.speed;
    // }

    public isInMotion(): boolean {
        const body = this.body as Phaser.Physics.Arcade.Body;
        return body.velocity.lengthSq() > 10;
    }


    public takeDamage(amount: number): void {
        // Убираем блокировку isHit для урона — теперь игрок всегда получает урон
        this.hp = Math.max(0, this.hp - amount);
        this.onHpChange?.(this.hp);

        // Анимация хита все еще срабатывает, но не блокирует урон
        this.playAnimation("player-hit");

        // Можно оставить isHit для визуальной "мерцалки" или эффекта
        this.isHit = true;

        // Быстрый сброс визуального эффекта, но урон уже можно получать
        this.scene.time.delayedCall(100, () => {
            this.isHit = false;
        });
    }


    update(time: number): void {
        if (!this.isRolling) {
            this.updateMovement();
            this.updateAnimation();
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.tryRoll(time);
        }

        this.onRollStateChange?.({
            current: this.rollCharges,
            max: this.MAX_ROLL_CHARGES,
            progress: this.getRollProgress(time),
        });

        this.updateRollRecharge(time);

        if (this.isInMotion()) {
            this.spawnCssTrail(time);
        }

        // синхронизация нимба
        this.halo.setPosition(this.x, this.y + HALO_OFFSET_Y);
    }

    enableHalo(): void {
        this.halo.setVisible(true);
    }

    disableHalo(): void {
        this.halo.setVisible(false);
    }

    destroy(fromScene?: boolean): void {
        this.halo.destroy();
        super.destroy(fromScene);
    }

}
