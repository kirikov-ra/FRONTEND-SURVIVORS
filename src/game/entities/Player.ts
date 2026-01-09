import Phaser from "phaser";

type KeyMap = {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
};

export class Player extends Phaser.Physics.Arcade.Sprite { 
  public hp: number;
  public maxHp: number;
  private speed = 200;

  private keys: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  
  private onHpChange?: (hp: number) => void;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(18, 24);
    body.setCollideWorldBounds(true);
    body.setImmovable(false); // для игрока и врагов
    body.setAllowGravity(false);
    
    this.hp = 100;
    this.maxHp = 100;

    this.keys = scene.input.keyboard!.addKeys("W,A,S,D") as KeyMap;
  }

   public setHpChangeCallback(cb: (hp: number) => void) {
    this.onHpChange = cb;
  }

  takeDamage(amount: number) {
    this.hp = Math.max(0, this.hp - amount);
    if (this.onHpChange) this.onHpChange(this.hp);
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (this.keys.W.isDown) body.setVelocityY(-this.speed);
    if (this.keys.S.isDown) body.setVelocityY(this.speed);
    if (this.keys.A.isDown) body.setVelocityX(-this.speed);
    if (this.keys.D.isDown) body.setVelocityX(this.speed);

    body.velocity.normalize().scale(this.speed);
  }

  
}