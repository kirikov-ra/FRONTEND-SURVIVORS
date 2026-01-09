import Phaser from "phaser";
import { gameConfig } from "./config/gameConfig";

export function startGame() {
  return new Phaser.Game(gameConfig);
}
