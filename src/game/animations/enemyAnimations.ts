import Phaser from "phaser";

export function createEnemyAnimations(anims: Phaser.Animations.AnimationManager) {
  if (anims.exists("enemy-walk")) return;

  anims.create({
    key: "enemy-walk",
    frames: anims.generateFrameNumbers("enemy_sprite_sheet", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "enemy-hit",
    frames: anims.generateFrameNumbers("enemy_sprite_sheet", { start: 4, end: 4 }),
    frameRate: 12,
    repeat: 0,
  });
}
