import Phaser from "phaser";
import type { MovementKeys } from "../types/Input";

type PlayerAnim = "player-idle" | "player-walk" | "player-hit";

export class Player extends Phaser.Physics.Arcade.Sprite {
    public hp: number;
    public maxHp: number;

    private speed = 200;
    private isHit = false;
    private hitCooldownMs = 300;
    private hitTimer?: Phaser.Time.TimerEvent;



    private keys: MovementKeys;
    private onHpChange?: (hp: number) => void;
    private onSpeedChange?: (speed: number) => void;
    private get bodyArcade(): Phaser.Physics.Arcade.Body {
      return this.body as Phaser.Physics.Arcade.Body;
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
    }

    private updateAnimation() {
      if (this.isHit) return;

      const body = this.bodyArcade;

      if (body.velocity.lengthSq() > 0) {
        this.flipX = body.velocity.x < 0;
        this.playAnimation("player-walk");
      } else {
        this.playAnimation("player-idle");
      }
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

      this.hp = 100;
      this.maxHp = 100;

      this.keys = scene.input.keyboard!.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        D: Phaser.Input.Keyboard.KeyCodes.D,
      }) as MovementKeys;
    }

    public setHpChangeCallback(cb: (hp: number) => void): void {
        this.onHpChange = cb;
    }
    // =============================================================== dorabotac
    public setSpeedChangeCallback(cb: (speed: number) => void): void {
        this.onSpeedChange = cb;
    }

    // public setSpeed(speed: number): void {
    //     if (this.speed === speed) return;
    //     this.speed = speed;
    //     this.onSpeedChange?.(this.speed);
    // }

    // public getSpeed(): number {
    //     return this.speed;
    // }


  public takeDamage(amount: number): void {
  if (this.isHit) return;

  this.hp = Math.max(0, this.hp - amount);
  this.onHpChange?.(this.hp);

  this.isHit = true;
  this.playAnimation("player-hit");

  this.hitTimer?.remove(false);

  this.hitTimer = this.scene.time.delayedCall(
    this.hitCooldownMs,
    () => {
      this.isHit = false;
    },
    undefined,
    this
  );
}

  update(): void {
    this.updateMovement();
    this.updateAnimation();
  }
}
