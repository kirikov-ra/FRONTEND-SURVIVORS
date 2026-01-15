import Phaser from "phaser";
import { Player } from "./Player";

type EnemyAnim = "enemy-walk" | "enemy-hit";

export type DamageSource =
  | "projectile"
  | "trail"
  | "contact"
  | "other";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    private speed = 150;

    /** Враг находится в состоянии получения урона (блокирует walk) */
    private isHit = false;

    private isDead = false;
    private target: Player;
    private hp = 100;
    private lastDamageTime = 0;

    private get bodyArcade(): Phaser.Physics.Arcade.Body {
        return this.body as Phaser.Physics.Arcade.Body;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, target: Player) {
        super(scene, x, y, "enemy_sprite_sheet");

        this.target = target;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.bodyArcade;
        body.setAllowGravity(false);
        body.setSize(18, 20);
        body.setOffset(0, 2);

        this.setDepth(10);
    }

    // -------------------------
    // Анимации
    // -------------------------
    private playAnimation(key: EnemyAnim): void {
        if (!this.anims) return;
        if (this.anims.currentAnim?.key === key) return;
        this.play(key);
    }

    private updateAnimation(): void {
        // Пока враг в hit-состоянии — walk запрещён
        if (this.isHit) return;
        this.playAnimation("enemy-walk");
    }

    // -------------------------
    // Damage feedback
    // -------------------------
    private handleHitFeedback(source: DamageSource): void {
        if (!this.scene) return;

        switch (source) {
            case "projectile":
            case "contact":
                this.playHitAnimation();
                break;

            case "trail":
                this.playTrailFeedback();
                break;
        }
    }

    /** Явное попадание (пуля / контакт) */
    private playHitAnimation(): void {
        if (this.isHit) return;

        this.isHit = true;
        this.playAnimation("enemy-hit");

        // Даем анимации гарантированно отыграть
        this.scene.time.delayedCall(150, () => {
            if (!this.active) return;
            this.isHit = false;
        });
    }

    /** DoT от трейла — только tint, без анимаций */
    private playTrailFeedback(): void {
        // если уже есть hit от пули — не перебиваем
        if (this.isHit) return;

        this.isHit = true;
        this.setTint(0x8fe4ff);

        this.scene.time.delayedCall(80, () => {
            if (!this.active) return;
            this.clearTint();
            this.isHit = false;
        });
    }

    // -------------------------
    // Lifecycle
    // -------------------------
    private die(): void {
        this.target.addExperience(1);
        this.destroy();
    }

    update(): void {
        const body = this.bodyArcade;

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return;

        body.velocity.x += (dx / dist) * 6;
        body.velocity.y += (dy / dist) * 6;
        body.velocity.limit(this.speed);

        this.updateAnimation();
    }

    // -------------------------
    // Public API
    // -------------------------
    public takeDamage(amount: number, source: DamageSource = "other"): void {
        if (this.isDead) return;

        this.hp -= amount;

        if (this.hp <= 0) {
            this.isDead = true;
            this.die();
            return;
        }

        this.handleHitFeedback(source);
    }

    public tryDealDamage(player: Player, time: number): void {
        if (time < this.lastDamageTime + 500) return;

        this.lastDamageTime = time;
        player.takeDamage(1);
    }

    public applySeparation(enemies: Enemy[]): void {
        const radius = 28;
        const force = 40;

        let pushX = 0;
        let pushY = 0;

        for (const other of enemies) {
            if (other === this) continue;

            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distSq = dx * dx + dy * dy;

            if (distSq === 0 || distSq > radius * radius) continue;

            const dist = Math.sqrt(distSq);
            const strength = (radius - dist) / radius;

            pushX += (dx / dist) * strength;
            pushY += (dy / dist) * strength;
        }

        this.bodyArcade.velocity.x += pushX * force;
        this.bodyArcade.velocity.y += pushY * force;
    }
}
