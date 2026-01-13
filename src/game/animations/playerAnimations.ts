import Phaser from "phaser";

export function createPlayerAnimations(anims: Phaser.Animations.AnimationManager) {
  if (anims.exists("player-idle")) return;

  anims.create({
    key: "player-idle",
    frames: anims.generateFrameNumbers("player_asset_sheet", { start: 0, end: 3 }),
    frameRate: 4,
    repeat: -1,
  });

  anims.create({
    key: "player-walk",
    frames: anims.generateFrameNumbers("player_asset_sheet", { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "player-hit",
    frames: anims.generateFrameNumbers("player_asset_sheet", { start: 8, end: 9 }),
    frameRate: 12,
    repeat: 0,
  });

  anims.create({
    key: "player-roll",
    frames: anims.generateFrameNumbers("player-roll", {
      // start: 12,
      // end: 17, // 6 кадров
      start: 0, end: 5
    }),
    frameRate: 20,
    repeat: 0,
  });
}
