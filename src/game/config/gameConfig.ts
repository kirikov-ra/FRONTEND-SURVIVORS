import Phaser from "phaser";
import { BootScene } from "../scenes/BootScene";
import { MainScene } from "../scenes/MainScene";
import { PauseScene } from "../scenes/PauseScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-root",
  backgroundColor: "#1e1e1e",

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      timeScale: 1,
      fps: 120,
    },
  },

  scene: [BootScene, MainScene, PauseScene],
};

// export const game = new Phaser.Game(gameConfig);