import Phaser from "phaser";
import { BootScene } from "../scenes/BootScene";
import { MainScene } from "../scenes/MainScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth ,
  height: window.innerHeight,
  backgroundColor: "#1e1e1e",
  parent: "game-root",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      timeScale: 1,
      fps: 120, // повысить, если много объектов
    },
  },
  scene: [BootScene, MainScene],
};
